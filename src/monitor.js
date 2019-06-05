const process = require('process');

class Monitor {
  constructor(interval) {
    this.inProgress = false;
    this.interval = interval || 360 // Default

    const handleSuicide = signal => {
      console.warn(`Save Sync has recieved ${signal}`);

      // Confirm that nothign is being written to the files
      // Zip the current files and move htem to a folder where 
      // they can either be uploaded automatically or manually

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
    // We want to keep a Backup of what the save scurrently are before we start messing with them
    // Before we start monitoring, we need to zip the current save files os the user can restore them.

    try {
      while (true) {
        this.inProgress = true;

        // Get known Directories
        // Compare File contents. Compare checksums(?) to figure out wheether the files have changed

        // Move files with different checksums(?) to where the files are backed up.
        console.log("Test");
        this.inProgress = false;
        await this.sleep(this.interval);
      }
    } catch(e) { throw e; }



  }
}

const monitor = new Monitor(parseFloat(process.argv[2]));
monitor.run();
