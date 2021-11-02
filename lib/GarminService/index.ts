import SupabaseService from "../SupabaseService";
import EmailService from "../EmailService";
import PuppeteerService from "../PuppeteerService";
import { Browser } from "puppeteer";

class GarminService {
    db: SupabaseService;
    emailService: EmailService;
    puppeteerService: PuppeteerService;

    constructor(puppeteerService = new PuppeteerService()) {
        this.db = new SupabaseService();
        this.emailService = new EmailService();
        this.puppeteerService = puppeteerService;
    }

    log(message) {
        console.log(`GARMIN SERVICE LOG - ${message}`);
    }

    async emailFailure(message: string) {
        return this.emailService.transport({
            to: process.env.MY_EMAIL,
            from: process.env.MY_EMAIL,
            subject: "Garmin Fetch Failed",
            text: message
        });
    }

    getDateString() {
        const today = new Date();

        return [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
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
            await this.emailFailure(e.message);
            return 44;
        }
    }

    async logIn() {
        try {
            const browser = await this.puppeteerService.getBrowser() as Browser;
            const [page] = await browser.pages();
            const headlessUserAgent = await page.evaluate(() => navigator.userAgent);
            const chromeUserAgent = headlessUserAgent.replace('HeadlessChrome', 'Chrome');
            await page.setUserAgent(chromeUserAgent);
            await page.setExtraHTTPHeaders({ 'accept-language': 'en-US,en;q=0.8' });
            await page.goto('https://connect.garmin.com/signin', { waitUntil: 'networkidle0' });
            const elementHandle = await page.$('#gauth-widget-frame-gauth-widget');
            const frame = await elementHandle.contentFrame();
            await frame.type('#username', process.env.GARMIN_USERNAME);
            await frame.type('#password', process.env.GARMIN_PASSWORD);

            const [response] = await Promise.all([
                frame.waitForNavigation({ waitUntil: 'networkidle0' }),
                frame.click('#login-btn-signin'),
            ]);

            this.log(`Signed into Garmin with this status code: ${response.status()}`);

            await page.waitForNavigation({ waitUntil: 'networkidle0' });

            return { page, browser };
        } catch (e) {
            this.log(e.message);
            await this.emailFailure(e.message);

            return {
                page: null, browser: null
            }
        }
    }

    async getHeartRateData(): Promise<any> {
        let { page, browser } = await this.logIn();

        const data = await new Promise(async (resolve) => {
            try {
                this.log('Listening for response...');

                page.on('response', async (response) => {
                    if (response.url().includes("wellness-service/wellness/dailyHeartRate")) {
                        return resolve(await response.json());
                    }
                });

                await page.setRequestInterception(true);

                page.on('request', (request) => {
                    if (request.url().includes('connect.garmin.com')) {
                        request.continue();
                    } else {
                        request.abort();
                    }
                });

                page.goto(`https://connect.garmin.com/modern/daily-summary/${this.getDateString()}/heartRate`, {
                    waitUntil: 'networkidle2'
                });
            } catch (e) {
                this.log(e.message);
            }
        });

        page && await page.close();
        browser && await browser.close();
        
        return data;
    }
}

export default GarminService;
