function press(v){document.getElementById('display').value += v}
function clearDisplay(){document.getElementById('display').value = ''}
function calculate(){try{document.getElementById('display').value = eval(document.getElementById('display').value)}catch(e){document.getElementById('display').value='Error'}}
