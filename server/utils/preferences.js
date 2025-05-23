// separates selections for each user preference category (i.e., self-care, coping strategies, affirmations)
// takes as input user preferences for one category and returns two arrays- one for selections that already
// exist in the public category database, and one for selections that the user custom-created
function createPreferences(userSelection) {
  const userSelectionExisting = [];
  const userSelectionNew = [];
  for (let i = 0; i < userSelection.length; i ++) {
    if (!userSelection[i].id) {
      userSelectionNew.push(userSelection[i]);
    }
    else {
      userSelectionExisting.push(userSelection[i]);
    }
  }
  return [userSelectionExisting, userSelectionNew];
}

module.exports = {createPreferences};