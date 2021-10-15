import puppeteer from "puppeteer";
import puppeteerAfp from "puppeteer-afp";

class GarminService {
    getDateString() {
        const today = new Date();

        return [
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        ].join('-');
    }

    async getRestingHeartRateForWeek() {
        try {
            const { lastSevenDaysAvgRestingHeartRate } = await this.getHeartRateData();

            return lastSevenDaysAvgRestingHeartRate;
        } catch(e) {
            console.error(`Could not get heart rate: ${e.message}`);
            return 45;
        }
    }

    async logIn() {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });
        const page = puppeteerAfp(await browser.newPage());
        await page.setRequestInterception(true);
        const headlessUserAgent = await page.evaluate(() => navigator.userAgent);
        const chromeUserAgent = headlessUserAgent.replace('HeadlessChrome', 'Chrome');
        await page.setUserAgent(chromeUserAgent);
        await page.setExtraHTTPHeaders({ 'accept-language': 'en-US,en;q=0.8' });
        await page.goto('https://connect.garmin.com/signin', { waitUntil: 'networkidle0' });
        const elementHandle = await page.$('#gauth-widget-frame-gauth-widget');
        const frame = await elementHandle.contentFrame();
        await frame.click('#login-remember');
        await frame.type('#username', process.env.GARMIN_USERNAME);
        await frame.type('#password', process.env.GARMIN_PASSWORD);

        const [response] = await Promise.all([
            frame.waitForNavigation({ waitUntil: 'networkidle0' }),
            frame.click('#login-btn-signin'),
        ]);

        if (!response.ok()) {
            console.error(`Sign in failed with this status code: ${response.status()}`);
        }

        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        return { page, browser };
    }

    async getHeartRateData(): Promise<any> {
        const { page, browser } = await this.logIn();

        const data = await new Promise(async (resolve) => {
            try {
                page.on('response', async (response) => {
                    if (response.url().includes("wellness-service/wellness/dailyHeartRate")) {
                        resolve(await response.json());
                    }
                });
        
                page.goto(`https://connect.garmin.com/modern/daily-summary/${this.getDateString()}/heartRate`, {
                    waitUntil: 'networkidle0'
                });
            } catch(e) {
                console.log(`Current URL: ${page.url()}`); 
                console.log(e.message);
            }
        });

        await browser.close();

        return data;
    }
}

export default GarminService;
