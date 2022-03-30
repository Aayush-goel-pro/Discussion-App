var submitQuestionNode = document.getElementById("submitBtn");

var questionTitleNode = document.getElementById("subject");
var questionDescriptionNode = document.getElementById("question");
var allQuestionsListNode = document.getElementById("dataList");

var createQuestionFormNode = document.getElementById("toggleDisplay");

// After click on particular question to see details
var questionDetailContainerNode = document.getElementById("respondQue");
var resolveQuestionContainerNode = document.getElementById("resolveHolder");
var resolveQuestionNode = document.getElementById("resolveQuestion");
var responseContainerNode = document.getElementById("respondAns");
var commentContainerNode = document.getElementById("commentHolder");
var comentatorNameNode = document.getElementById("pickName");
var commentNode = document.getElementById("pickComment");
var submitCommentNode = document.getElementById("commentBtn");
var questionSearchNode = document.getElementById("questionSearch");

var upvote =document.getElementById("upvote");
var downvote =document.getElementById("downvote");
var resolveButtonNode = document.getElementById("resolveQuestion")
var newQuestionForm=document.getElementById("newQuestionForm");
newQuestionForm.addEventListener("click",showTheQuesForm);
function showTheQuesForm()
{
  
     questionDetailContainerNode.style.display="none";
     resolveQuestionContainerNode.style.display="none",
    responseContainerNode.style.display="none";
    commentContainerNode.style.display="none";
      createQuestionFormNode.style.display="block";
  
}
questionSearchNode.addEventListener("keyup",function(event)
{
  //filter the result
  filterResult(event.target.value);
})
//func to filter the result
function filterResult(query)
{
  var allQuestions=getAllQuestions();
    clearQuestionPanel();
  if(query)
  {
   
    
  var filteredQuestions=allQuestions.filter(function(question)
    {
      if(question.title.includes(query))
      {
        return true;
      }
     
    });
    if(filteredQuestions.length)
    {
      filteredQuestions.forEach(function(question)
      {
        addQuestionToPanel(question);
      })
    }
    else{
      printNoMatchFound();
    }
  }
  else{

 allQuestions.forEach(function(question)
 {
   addResponseInPanel(question);

 })
  }
}


// print NO MATCH FOUND
function printNoMatchFound(){
    var title = document.createElement("h1");
    title.innerHTML = "No Match Found";
    allQuestionsListNode.appendChild(title);
}
//clear question panel
function clearQuestionPanel(){
  allQuestionsListNode.innerHTML="";

}


function onload()
{
  //get all ques from storage

  getAllQuestions(function(allQuestions)
  {
     allQuestions=allQuestions.sort(function(cQ,nQ)
  {
    if(cQ.isFav)
    {
      return -1;
    }
    return 1;
  })
  allQuestions.forEach(function(question)
  {
    addQuestionToPanel(question);
  })

  });
 
}
onload();
submitQuestionNode.addEventListener("click",onQuestionSubmit);

function onQuestionSubmit(){

    var question = {
        title: questionTitleNode.value,
        description: questionDescriptionNode.value,
        responses: [],
        upvotes: 0,
        downvotes: 0,
        createdAt: Date.now(),
        ifFav: false,
    }

    saveQuestion(question,function()
  {
    addQuestionToPanel(question);
    
  });
    clearQuestionForm();
}



// Save question to storage
function saveQuestion(question,saveQuestionToPanel){

    getAllQuestions(function(allQuestions)
  {
    allQuestions.push(question);
  
    // console.log(allQuestions);

      var body={
    data:JSON.stringify(allQuestions)
    }

    var request =new XMLHttpRequest();
    request.open("POST"," https://storage.codequotient.com/data/save");
    request.setRequestHeader("Content-type",'application/json');
    request.send(JSON.stringify(body));
    request.addEventListener("load",function()
    {
      saveQuestionToPanel();
    })

    });
}

// get all questions from storage
function getAllQuestions(onResponseFromServer){

    var request=new XMLHttpRequest();
  request.addEventListener("load",function()
  {
    var dataFromServer=JSON.parse(request.responseText);
    //calling onresponsefromserver.this is called callback
    onResponseFromServer(JSON.parse(dataFromServer.data));
  })
  request.open("GET","https://storage.codequotient.com/data/get");
  request.send();
}

// append question to the left panel

function addQuestionToPanel(question) {

    var questionContainer = document.createElement("div");
        questionContainer.style.backgroundColor="grey";
        questionContainer.setAttribute("id",question.title);
        
    var newQuestionTitleNode = document.createElement("h5");
        newQuestionTitleNode.innerHTML = question.title;
        questionContainer.appendChild(newQuestionTitleNode);
        
    var newQuestionDescriptionNode = document.createElement("p");
        newQuestionDescriptionNode.innerHTML = question.description;
        questionContainer.appendChild(newQuestionDescriptionNode);
        

    var upvoteTextNode = document.createElement("p");
        upvoteTextNode.innerHTML = "upvote = "+ question.upvotes;
        questionContainer.appendChild(upvoteTextNode);
    
    var downvoteTextNode = document.createElement("p");
        downvoteTextNode.innerHTML = "downvote = "+ question.downvotes;
        questionContainer.appendChild(downvoteTextNode);

    var creationDateAndTimeNode = document.createElement("p");
        creationDateAndTimeNode.innerHTML = new Date(question.createdAt).toLocaleString();
        questionContainer.appendChild(creationDateAndTimeNode);
    
    var createdAtNode = document.createElement("p");
        createdAtNode.innerHTML= "Created: "+ convertDateToCreatedAtTime(question.createdAt) + " ago";
        questionContainer.appendChild(createdAtNode);

    // resfesh time every second
    //refreshSecond(question,createdAtNode);

        setInterval(function(){
        createdAtNode.innerHTML= "Created: "+ convertDateToCreatedAtTime(question.createdAt) + " ago";    
        },1000)

        var addToFavNode = document.createElement("button");
         addToFavNode.setAttribute("id","Fav");
        if(question.isFav)
        {
        addToFavNode.innerHTML = "Remove Fav";

        }
        else {
            addToFavNode.innerHTML = "Add Fav";
        }

        addToFavNode.addEventListener("click",toggleFavQuestion(question));
         questionContainer.appendChild(newQuestionTitleNode);
  questionContainer.appendChild(newQuestionDescriptionNode);
  questionContainer.appendChild(upvoteTextNode);
  questionContainer.appendChild(downvoteTextNode);
  questionContainer.appendChild(creationDateAndTimeNode);
  questionContainer.appendChild(createdAtNode );
   questionContainer.appendChild(addToFavNode);
  allQuestionsListNode.appendChild(questionContainer);
  questionContainer.addEventListener("click",onQuestionClick(question));
    // clearQuestionForm();
}

// toggle Favourite Question
function toggleFavQuestion(question)
{
    return function(event)
    {
         event.stopPropagation();
        question.isFav = !question.isFav;
        updateQuestion(question);   
        if(question.isFav)
        {
        event.target.innerHTML = "Remove Fav";

        }
        else {
            event.target.innerHTML = "Add Fav";
        } 
    }
}


//convert date to hours ago like format
function convertDateToCreatedAtTime(date)
{
    var currentTime = Date.now();
    var timeLapsed = currentTime - new Date(date).getTime();

    var secondsDiff = parseInt(timeLapsed / 1000 );
    var minutesDiff = parseInt(secondsDiff / 60 );
    var hourDiff = parseInt(minutesDiff / 60 );

    return hourDiff +" hours "+ minutesDiff +" minutes " + secondsDiff +" Seconds"
 
}




// clear Question Form
function clearQuestionForm(){
    questionTitleNode.value=""
    questionDescriptionNode.value = "";
}

// listen for click on the question in right panel 
function onQuestionClick(question){

    return function(){

        // clouser you can access question variable
        // hide question panel
        hideQuestionPanel();

        // clear last details 
        clearQuestionDetails();
        clearResponsePanel();


        //show clicked question
        showDetails();

        //create question details
        addQuestionToRight(question);

        //show all previous questions
        question.responses.forEach(function(response){
            addResponseInPanel(response);

        })

        // listen for response Submit
        //console.log("count");
        submitCommentNode.onclick = onResponseSubmit(question);

        upvote.onclick=upvoteQuestion(question);
        downvote.onclick= downvoteQuestion(question);
    
        resolveButtonNode.onclick = resolveQuestion(question);
    }
}

// upvotes
function upvoteQuestion(question)
{
    return function(){
        question.upvotes++;
    updateQuestion(question);
    updateQuestionUI(question);
    }
}

//downvotes
function downvoteQuestion(question)
{
    return function(){
        question.downvotes++;
    updateQuestion(question);
    updateQuestionUI(question);
    }
}

//update Question UI
function updateQuestionUI(question)
{
    // get Question container from DOM
    var questionContainerNode = document.getElementById(question.title);

    questionContainerNode.childNodes[2].innerHTML = "upvote = "+question.upvotes;
    questionContainerNode.childNodes[3].innerHTML = "downvote = "+question.downvotes;
}


// listen for click on submit response button 

function onResponseSubmit(question){
return function(){

    console.log("hello");
    var response = {
        name: comentatorNameNode.value,
        description: commentNode.value,
        isFav:false,
    };

    saveResponse(question, response);
    addResponseInPanel(response);
    //addResponseInPanel(response);
}
}

// save responses
function saveResponse(updatedQuestion,response){ 

    getAllQuestions(function(allQuestions)
  {
    
        var revisedquestion = allQuestions.map(function(question)
     {
      if(updatedQuestion.title===question.title)
    {
      question.responses.push(response)
    }
      return question;
  });
       updateData(revisedquestion);
  });
}

//function addResponseInPanel(question){
function addResponseInPanel(response){


    var userName=document.createElement("h4");
  userName.innerHTML=response.name;
  var userComment=document.createElement("h5");
  userComment.innerHTML=response.description;

  var container=document.createElement("div");
  container.setAttribute("id","container");
  container.appendChild(userName);
  container.appendChild(userComment);

    responseContainerNode.appendChild(container);
}

//toggle Response
function toggleFavResponse(response)
{
    return function(event)
    {
        response.isFav = !response.isFav;
        //saveResponse(question,response);
        if(question.isFav)
        {
        event.target.innerHTML = "Remove Fav";

        }
        else {
            event.target.innerHTML = "Add Fav";
        } 
    }
}


// hide question panel
function hideQuestionPanel(){

    createQuestionFormNode.style.display = "none";
}

// display Question Details
function showDetails(){

    questionDetailContainerNode.style.display= "block"; 
    resolveQuestionContainerNode.style.display= "block"; 
    responseContainerNode.style.display= "block"; 
    commentContainerNode.style.display= "block"; 


}

// show question 
function addQuestionToRight(question){

    var titleNode = document.createElement("h4");
    titleNode.innerHTML = question.title;

    var descriptionNode = document.createElement("p");
    descriptionNode.innerHTML = question.description;

    questionDetailContainerNode.appendChild(titleNode);
    questionDetailContainerNode.appendChild(descriptionNode);


}

// update question
function updateQuestion(updatedQuestion) 
{
    getAllQuestions(function(allQuestions){
   
   var revisedquestion=allQuestions.map(function(question)
    {
    if(updatedQuestion.title===question.title)
    {
      return updatedQuestion;
    }
    return question;
    
    })
  
  
   var request=new XMLHttpRequest();
    request.open("POST"," https://storage.codequotient.com/data/save");
    request.setRequestHeader("Content-type",'application/json');
    request.send(JSON.stringify(revisedquestion));
    
    });
}




// clearing question pannel
function clearQuestionDetails(){
    questionDetailContainerNode.innerHTML = "";
}

function clearResponsePanel(){

    responseContainerNode.innerHTML= "";
}



// creating response template
function createResponseTemplate(responseName , responseDescription){

    var responseeName = document.createElement("h5");
    var responseeComment = document.createElement("p");
    var container = document.createElement("div");


        responseeName.innerHTML = responseName;
        responseeComment.innerHTML = responseDescription;
        
            container.appendChild(responseeName);
            container.appendChild(responseeComment);

    responseContainerNode.appendChild(container);
}



// resolve Question 
function resolveQuestion(question){


    return function(){
    getAllQuestions(function(allQuestions)
   {
     
        var index = allQuestions.indexOf(question);
        allQuestions.splice(index,1);
    
      updateData(allQuestions);
   });
   
  
    var resolveQuestionContainerNode = document.getElementById(question.title);
     resolveQuestionContainerNode.remove();
     showTheQuesForm();

    }
}

function updateData(allQuestions,update)
{
  var body = {
      data: JSON.stringify(allQuestions)
  }

    var request = new XMLHttpRequest();

    request.open("POST", "https://storage.codequotient.com/data/save");
    request.setRequestHeader("Content-type","application/json"); 

    request.send(JSON.stringify(body));

    request.addEventListener("load", function()
    {
       update();
    
    })
}


// show question panel
function showQuestionPanel(){

    createQuestionFormNode.style.display = "block";
}

// hide Question Details
function hideDetails(){

    questionDetailContainerNode.style.display= "none"; 
    resolveQuestionContainerNode.style.display= "none"; 
    responseContainerNode.style.display= "none"; 
    commentContainerNode.style.display= "none"; 


}

