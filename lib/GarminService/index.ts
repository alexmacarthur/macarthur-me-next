import puppeteer from "puppeteer";
import SupabaseService from "../SupabaseService";

class GarminService {
    db: SupabaseService;

    constructor() {
        this.db = new SupabaseService();
    }

    log(message) {
        console.log(`GARMIN SERVICE LOG - ${message}`);
    }

    getDateString() {
        const today = new Date();

        return [
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        ].join('-');
    }

    async getRestingHeartRateForWeek(): Promise<number> {

        const savedValue = await this.db.getDashboardValue('resting_heart_rate_for_week');

        if(savedValue && !savedValue.hasExpired) {
            this.log('Using value cached in DB');
            return savedValue.value;
        }

        try {
            const { lastSevenDaysAvgRestingHeartRate } = await this.getHeartRateData();

            this.log(`Found resting heart rate: ${lastSevenDaysAvgRestingHeartRate}`);

            await this.db.updateDashboardValue('resting_heart_rate_for_week', lastSevenDaysAvgRestingHeartRate);

            return lastSevenDaysAvgRestingHeartRate;
        } catch (e) {
            this.log(`Could not get heart rate: ${e.message}`);
            return 45;
        }
    }

    async logIn() {
        try {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox']
            });
            const [page] = await browser.pages();
            const headlessUserAgent = await page.evaluate(() => navigator.userAgent);
            const chromeUserAgent = headlessUserAgent.replace('HeadlessChrome', 'Chrome');
            await page.setUserAgent(chromeUserAgent);
            await page.setExtraHTTPHeaders({ 'accept-language': 'en-US,en;q=0.8' });
            await page.goto('https://connect.garmin.com/signin', { waitUntil: 'networkidle2' });
            const elementHandle = await page.$('#gauth-widget-frame-gauth-widget');
            const frame = await elementHandle.contentFrame();
            await frame.type('#username', process.env.GARMIN_USERNAME);
            await frame.type('#password', process.env.GARMIN_PASSWORD);

            const [response] = await Promise.all([
                frame.waitForNavigation({ waitUntil: 'networkidle2' }),
                frame.click('#login-btn-signin'),
            ]);

            this.log(`Signed into Garmin with this status code: ${response.status()}`);

            await page.waitForNavigation({ waitUntil: 'networkidle2' });

            return { page, browser };
        } catch (e) {
            this.log(e.message);

            return {
                page: null, browser: null
            }
        }
    }

    async getHeartRateData(): Promise<any> {
        const { page, browser } = await this.logIn();

        if (!page || !browser) {
            this.log("Either a page or browser wasn't returned.");
            return {};
        }

        const data = await (new Promise(async (resolve, reject) => {
            try {
                const listenForData = async (response) => {
                    if (response.url().includes("wellness-service/wellness/dailyHeartRate")) {
                        return resolve(await response.json());
                    }
                }
                
                page.on('response', listenForData);

                await page.goto(`https://connect.garmin.com/modern/daily-summary/${this.getDateString()}/heartRate`, {
                    waitUntil: 'networkidle2'
                });
            } catch (e) {
                reject(e.message);
            }
        }));

        await page.close();
        await browser.close();

        return data;
    }
}

export default GarminService;
