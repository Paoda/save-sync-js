const process = require('process');
const SaveController = require('./main/controllers/saveController');

class Monitor {
  constructor(interval) {
    this.inProgress = false;
    this.interval = interval || 3600 // Default

    const waitUntilReady = async (cb) => {
      while (this.inProgress) {
        console.log("Waiting for backup to finish.");

        await this.sleep(3);
      }

      cb()
    }

    this.handleSuicide = signal => {
      return new Promise((res, rej) => {
        console.warn(`Save Sync has recieved ${signal}`);
        waitUntilReady(() => {
          res();
          // process.exit(0);
        });

      });


    }

    process.on('SIGINT', this.handleSuicide);
    process.on('SIGTERM', this.handleSuicide)
  }

  sleep(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000))
  }

  async run() {
    console.log("Monitor Start");
    const saveController = new SaveController();

    while (true) {
      this.inProgress = true;

      await saveController.syncAll();
      
      this.inProgress = false;
      await this.sleep(this.interval);
    }
  }

  stop(msg) {
    return new Promise((res, rej) => {
      this.handleSuicide(msg).then(() => res());
    });
  }
}

module.exports = Monitor;
