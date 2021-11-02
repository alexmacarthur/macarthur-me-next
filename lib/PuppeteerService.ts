import chrome from 'chrome-aws-lambda';
import puppeteer from 'puppeteer';
import puppeteerCore from 'puppeteer-core';

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

    getPuppeteer() {
        return this.isRunningLocally() ? puppeteer : puppeteerCore;
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
        const puppeteer = this.getPuppeteer();
        const chromeInstance = this.getChrome();
        const launchParameters: Chrome = {
            headless: true,
            args: ['--no-sandbox']
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
