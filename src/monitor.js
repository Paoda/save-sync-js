const process = require('process');
const SaveController = require('./main/controllers/saveController');

class Monitor {
  constructor(interval) {
    this.inProgress = false;
    this.interval = interval || 360 // Default

    const handleSuicide = signal => {
      console.warn(`Save Sync has recieved ${signal}`);

      const waitUntilReady = async () => {
        while (this.inProgress) {
          console.log("Waiting for backup to finish.");

          await this.sleep(3);
        }

        process.exit(0);
      }

      waitUntilReady();
    }

    process.on('SIGINT', handleSuicide);
    process.on('SIGTERM', handleSuicide)
  }

  sleep(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000))
  }

  async run() {
    const saveController = new SaveController();

    while (true) {
      this.inProgress = true;

      await saveController.syncAll();
      
      this.inProgress = false;
      await this.sleep(this.interval);
    }
  }
}

const monitor = new Monitor(parseFloat(process.argv[2]));
monitor.run();
