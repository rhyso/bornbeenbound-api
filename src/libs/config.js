var path       = require('path');
var config     = require('nconf');
var configFile = process.env.CONFIG;

if (configFile) {

    try {
        config.file(
            path.resolve(configFile)
        );
    } catch (error) {
        console.error('Cannot parse config: ' + args.config + '. Exiting.', error);
        process.exit(1);
    }

} else {
    console.error('A config file is required. Exiting.');
    process.exit(1);
}

module.exports = config;
