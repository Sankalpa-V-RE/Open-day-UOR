const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'public/index.html');
let content = fs.readFileSync(file, 'utf-8');

const oldText = "We warmly invite all students awaiting A/L results to come and experience real life at the Faculty of Engineering, University of Ruhuna. Discover, connect, and make the right decision for your future.";
const newText = "We warmly invite all students who have received their A/L results and are currently awaiting campus selection to come and experience real life at the Faculty of Engineering, University of Ruhuna. Explore our campus, connect with our community, and gain the clarity you need to make the right decision for your future.";

if (content.includes(oldText)) {
  content = content.replace(oldText, newText);
  fs.writeFileSync(file, content, 'utf-8');
  console.log("Replaced successfully!");
} else {
  // Try line by line or ignoring whitespace
  const minifiedContent = content.replace(/\\s+/g, ' ');
  const minifiedOld = oldText.replace(/\\s+/g, ' ');
  if (minifiedContent.includes(minifiedOld)) {
     console.log("Substring found with different whitespace, updating with regex.");
     const regex = new RegExp("We\\\\s+warmly\\\\s+invite\\\\s+all\\\\s+students\\\\s+awaiting\\\\s+A/L\\\\s+results\\\\s+to\\\\s+come\\\\s+and\\\\s+experience\\\\s+real\\\\s+life\\\\s+at\\\\s+the\\\\s+Faculty\\\\s+of\\\\s+Engineering,\\\\s+University\\\\s+of\\\\s+Ruhuna.\\\\s+Discover,\\\\s+connect,\\\\s+and\\\\s+make\\\\s+the\\\\s+right\\\\s+decision\\\\s+for\\\\s+your\\\\s+future.");
     content = content.replace(regex, newText);
     fs.writeFileSync(file, content, 'utf-8');
     console.log("Replaced successfully via regex!");
  } else {
     console.log("Could not find the text!");
  }
}
