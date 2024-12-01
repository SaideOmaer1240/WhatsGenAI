function sleep(seconds) { 
    const milliseconds = seconds * 1000; 
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
  
  module.exports = sleep;
  