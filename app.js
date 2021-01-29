let selectedFile;
let resSchema = {}
let colorize = 1;
let colorize_choice = '';

document.getElementById('input').addEventListener("change", (event) => {
    selectedFile = event.target.files[0];
    resSchema = {}
});

document.getElementById('button').addEventListener("click", () => {
    resSchema = {}

    if(selectedFile){
        document.getElementById('placeholder').innerHTML = '';
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile);
        fileReader.onload = (event)=>{
         let data = event.target.result;
         let workbook = XLSX.read(data,{type:"binary"});
         workbook.SheetNames.forEach(sheet => {
              let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
              console.log(rowObject);

              rowObject.map(student => {
                    st_data = {}
                    st_score = student['score']
                    // typeof student['score'] == 'number' ? Number(n.toString().substring(0,3).replace(n.toString().charAt(0), n.toString().charAt(0) + '.')) : Number(student['score'])

                  if(resSchema[student['name']] != undefined) {
                      _tries = resSchema[student['name']].tries
                      resSchema[student['name']].tries = _tries + 1

                      resSchema[student['name']].first_grade = st_score
                      resSchema[student['name']].scores.push(st_score)

                      resSchema[student['name']].final_grade = resSchema[student['name']].final_grade < st_score ? st_score : resSchema[student['name']].final_grade;

                  } else {
                      // Num. de intentos (test hecho) x alumno
                      st_data['tries'] = 1
                      // Nota de cada alumno x intento
                      st_data['scores'] = [st_score]
                     // Nota final x alumno
                     st_data['final_grade'] = st_score
                    // Nota 1r intento x alumno
                    st_data['first_grade'] =  st_score

                     resSchema[student['name']] = st_data
                  }
                });

              
                let mediana_first_grade = 0;
                let mediana_final_grade = 0;
                let mediana_tries = 0;

                let testSobreX = [];

                Object.keys(resSchema).map(student => {
                    resSchema[student].scores = resSchema[student].scores.reverse().join(' | ')
                    mediana_first_grade += Number(resSchema[student].first_grade)
                    mediana_final_grade += Number(resSchema[student].final_grade)
                    mediana_tries += Number(resSchema[student].tries)

                    testSobreX.push(resSchema[student].final_grade)
                })

                testSobreX = Math.max(...testSobreX)

              console.table(resSchema)
              // Nota mediana 1r intento x todos
              console.log('MEDIANA PRIMER INTENTO TEST: ' + (mediana_first_grade / Object.keys(resSchema).length).toFixed(2))
              console.log('MEDIANA ULTIMO INTENTO TEST: ' + (mediana_final_grade / Object.keys(resSchema).length).toFixed(2))
              console.log('MEDIANA INTENTOS TEST: ' + (mediana_tries / Object.keys(resSchema).length).toFixed(2))

              document.getElementById("listContainer").innerHTML = ''

              
              Object.keys(resSchema).map((student, i) => {
                colorize++;
                colorize_choice = colorize % 2 == 0 ? 'list-group-item-dark' : 'list-group-item-info'
                let anch = document.createElement('li');
                anch.innerHTML = `
                        <span class="badge bg-light"><strong>${Object.keys(resSchema)[i].toUpperCase()}</strong></span> <br> 
                        <span class="badge bg-success" style="color:white;"><strong><i>TRIES:</i></strong> ${resSchema[student].tries}</span>  /  
                        <span class="badge bg-warning text-dark"><strong><i>SCORES:</i></strong> ${resSchema[student].scores}</span>   /  
                        <span class="badge bg-danger" style="color:white;"><strong><i>FIRST GRADE:</i></strong> ${resSchema[student].first_grade}</span> /  
                        <span class="badge bg-info" style="color:white;"><strong><i>FINAL GRADE:</i></strong> ${resSchema[student].final_grade}</span>
                `;

                anch.classList.add('list-group-item', 'list-group-item-action', colorize_choice);
                document.getElementById("listContainer").appendChild(anch)
                document.getElementById("listContainer").classList.add('list')
              });

              let mediana = document.createElement('h5');
              // mediana.classList.add('display-4')
              document.getElementById("mediana-wrapper").innerHTML = '';

              let averageScoreFirstGrade = (mediana_first_grade / Object.keys(resSchema).length).toFixed(2);
              let averageScoreFinalGrade = (mediana_final_grade / Object.keys(resSchema).length).toFixed(2);

              mediana.innerHTML= `
                    <span class="badge rounded-pill bg-success" style="color:white;font-size:20px;margin:5px;">Average Tries: 
                        ${(mediana_tries / Object.keys(resSchema).length).toFixed(2)}</span>
                    <span class="badge rounded-pill bg-danger" style="color:white;font-size:20px;margin:5px;">Average Score First Grade: 
                        ${averageScoreFirstGrade} | ${averageScoreFirstGrade * 10 / testSobreX} </span>
                    <span class="badge rounded-pill bg-info" style="color:white;font-size:20px;margin:5px;">Average Score Final Grade: 
                        ${averageScoreFinalGrade} | ${averageScoreFinalGrade * 10 / testSobreX}</span>
              `;
              
              document.getElementById("mediana-wrapper").appendChild(mediana)
         });
        }
    }
});


