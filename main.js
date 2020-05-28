const Apify = require('apify');
const {crawl} = require("./data");

const credential = [
    {"username":"", "password":"" },
];

var user = true;
const pool = new Apify.AutoscaledPool({ 
    minConcurrency: 1,
    maxConcurrency: 10,
    runTaskFunction: async () => {
        for(var i = 0;i < credential.length;i++){
            user = crawl(credential[i]);
        }
    },
    isFinishedFunction: async () => {
        return user;
    },
    isTaskReadyFunction: async () => {  
        return user;
    },
});
(async () => {
    await pool.run();
})();