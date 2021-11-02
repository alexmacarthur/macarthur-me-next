import chrome from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

interface Chrome {
    headless?: boolean
    args: any[],
    defaultViewport?: any, 
    executablePath?: string,
}

class Puppeteer {
    isRunningLocally(): boolean {
        return !process.env.AWS_LAMBDA_FUNCTION_NAME;
    }

    getChrome(): Chrome {
        if (this.isRunningLocally()) {
            return {
                args: [],
                defaultViewport: '',
                executablePath: ''
            }
        }

        return chrome as unknown as Chrome;
    }

    async getBrowser() {
        const chromeInstance = this.getChrome();
        const launchParameters: Chrome = {
            headless: true,
            args: ['--no-sandbox'],
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        };

        if(!this.isRunningLocally()) {
            launchParameters.args = [...launchParameters.args, ...chromeInstance.args];
            launchParameters.executablePath = await chromeInstance.executablePath;
            launchParameters.defaultViewport = chromeInstance.defaultViewport;
        }

        return puppeteer.launch(launchParameters);
    }
}

export default Puppeteer;
