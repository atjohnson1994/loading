function init() {


  // Extract the line number from the filename
const filename = window.location.pathname.split('/').pop(); // Get the filename
const lineNumber = filename.split('_')[1].split('.')[0]; // Extract the line number

for (let j = 1; j <= 22; j++) {
    // Determine the table number based on the line number
    const tableNumber = `Table${lineNumber}_${j}`;
    const fdData = data[tableNumber][`Freeze Dryer ${j}`];
    document.getElementById(`FD${j}`).innerHTML = fdData[1];
    document.getElementById(`FD${j}_image`).src = `../resources/${fdData[1].toLowerCase()}.jpg`;

    // Array to keep track of encountered values
    const encounteredValues = [];

    for (let i = 2; i <= 16; i++) {
        // Check if the value is a duplicate by comparing the first 8 letters
        const value = fdData[i];
        const truncatedValue = value.slice(0, 8); // Get the first 8 letters
        const isDuplicate = encounteredValues.some(existingValue => existingValue.slice(0, 8) === truncatedValue);

        if (isDuplicate) {
            // If duplicate, set the innerHTML to an empty string
            document.getElementById(`FD${j}_tray${i - 1}`).innerHTML = "";
        } else {
            // If not a duplicate, split the value at the first space
            const [textBeforeSpace, textAfterSpace] = value.split(' ');

            // Set the innerHTML to the value before the space
            document.getElementById(`FD${j}_tray${i - 1}`).innerHTML = textBeforeSpace;

            // Create a new <h3> element with the text after the space and append it before the element
            const h3Element = document.createElement('h3');
            h3Element.textContent = textAfterSpace;
            document.getElementById(`FD${j}_tray${i - 1}`).parentNode.insertBefore(h3Element, document.getElementById(`FD${j}_tray${i - 1}`));

            // Add the value to encounteredValues
            encounteredValues.push(truncatedValue);
        }
    }
}


  // Get the container div
  const container = document.getElementById('fdPanel');

  // Get all the paragraphs inside the container
  const paragraphs = container.getElementsByTagName('p');

  // Create an array to store unique paragraphs
  const uniqueParagraphs = [];

  // Loop through the paragraphs
  for (let i = 0; i < paragraphs.length; i++) {
    const currentParagraph = paragraphs[i].textContent;
    // Check if the current paragraph is not already in the uniqueParagraphs array
    if (!uniqueParagraphs.includes(currentParagraph)) {
      uniqueParagraphs.push(currentParagraph); // If not, add it to the uniqueParagraphs array
    } else {
      // If it is, remove it from the DOM
      container.removeChild(paragraphs[i]);
    }
  }



}

function changeColor(button) {
  button.classList.toggle("clicked");
    // button.disabled = true; // Disable the button after clicking if you want
}

var nameToChange;
// Function to open the dialog box
function openDialog(fd) {
  nameToChange = fd
  document.getElementById("overlay").style.display = "block";
  document.getElementById('textInput').focus(); // Automatically focus on the text box
}

// Function to submit text and display it on the page
function submitText() {
  var text = document.getElementById("textInput").value;
  document.getElementById("FD" + nameToChange).textContent = text;
  document.getElementById("FD" + nameToChange + "_image").src = `../resources/${text.toLowerCase()}.jpg`;
  document.getElementById("overlay").style.display = "none";
  // Reset the value of the text input field
  document.getElementById("textInput").value = "";
}

function cancel() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("importOverlay").style.display = "none";
  document.getElementById("removalOverlay").style.display = "none";
}

function importData() {
  // Get the value from the text input
  var importedData = document.getElementById("importData").value;
  parsedData = JSON.parse(importedData);
  data = parsedData;
  
  document.getElementById("importOverlay").style.display = "none";
  init();
}

function openImportData() {
  navigator.clipboard.readText()
  .then(text => {
    var clipboardInput = text;
    data = JSON.parse(clipboardInput)
    init();
  })


  // Add event listener for keydown event
  document.getElementById('importData').addEventListener('keydown', function(event) {
    // Check if the key pressed is the Enter key
    if (event.key === 'Enter') {
      // Select the import button
      document.getElementById('importButton').click();
    }
  });
}
function openRemovalDialog(fd) {
  nameToChange = fd;
  document.getElementById("removalOverlay").style.display = "block";
  document.getElementById('lot-input').focus(); // Automatically focus on the text box
}

function removeOrAddLot() {
  var textToRemove = document.getElementById("lot-input").value.trim().toUpperCase();
  var specificElement = document.getElementById("panel" + nameToChange); 
  var paragraphs = specificElement.getElementsByTagName("p");
  var found = false;
  
  for (var i = 0; i < paragraphs.length; i++) {
    if (paragraphs[i].textContent.trim() === textToRemove) {
      paragraphs[i].parentNode.removeChild(paragraphs[i]);
      found = true;
      break; // Stop searching after the first match is removed
    } 
  }
  
  if (!found) {
    // If the text to remove is not found, add it as a new <p> element
    var newParagraph = document.createElement("p");
    newParagraph.textContent = textToRemove;
    specificElement.appendChild(newParagraph);
  }
  
  document.getElementById("removalOverlay").style.display = "none";
  document.getElementById("lot-input").value = "";
}


window.onload = init;