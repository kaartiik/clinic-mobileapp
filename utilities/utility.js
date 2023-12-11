 
 //Converts time string e.g. 09:00 AM to timestamp
 const convertStringToTimestamp = (timeString) => {
   // Get today's date
   let today = new Date();

   // Parse the time string
   let parts = timeString.match(/(\d+):(\d+) (\w+)/);
   let hours = parseInt(parts[1], 10);
   let minutes = parseInt(parts[2], 10);
   let meridian = parts[3];

   // Convert 12-hour format to 24-hour format
   if (meridian == "PM" && hours < 12) {
   hours += 12;
   } else if (meridian == "AM" && hours == 12) {
   hours = 0;
   }

   // Set hours and minutes to today's date
   today.setHours(hours, minutes, 0, 0);

   // Get the timestamp
   let timestamp = today.getTime();

   return timestamp;

 }

 export default convertStringToTimestamp;