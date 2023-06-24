const { google } = require('googleapis');
const credentials = require('path-to-key-file.json');
const fs = require('fs');
const jsonData = require('path-to-JSON-data.json')

const spreadsheetId = 'google-sheet-id';
const sheetName = 'sheet-name';




// Function to insert JSON data into Google Sheets and replace the existing data
async function insertJSONIntoSheet() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth });

    // get the reviews from the JSON data
    const reviews = jsonData.reviews;

    
    const columnNames = ['Name', 'Location', 'Rating', 'Text', 'Date'];//only for first entry, if columns already named remove

   //if columns already named remove columnNames. Gets data from JSON
    const valuesWithColumnNames = [columnNames, ...reviews.map(review => [
      review.name,
      review.location,
      review.rating,
      review.text,
      review.date
    ])];

  
    //clears data on sheet before entering new data
await sheets.spreadsheets.values.clear({
  spreadsheetId,
  range: `${sheetName}!A1:Z100000`
})

    // Insert the JSON data
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1:E`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: valuesWithColumnNames
      }
    });


  } catch (error) {
    console.error('Error inserting data:', error);
  }
}


insertJSONIntoSheet();
