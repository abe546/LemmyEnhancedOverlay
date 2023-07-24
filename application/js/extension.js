/* jshint esversion: 8 */
const POST = "post";
const EXPANDO_SPACE = "expando ";
const EXPANDO = "expando";
const IMAGE = "image";
const RANK = "rank";
const NEXT = "next";
const PREV = "prev";
const PAGER = "pager";
const PROCESSED_POST = "processedPost";

const ESCAPE_KEY = 27;
const S_KEY = 83;
const W_KEY = 87;
const SHIFT = 16;
const SPACE_BAR = 32;

const nextPageWarning = "https://i.imgur.com/rmF0e71.png";

var index = 0;
var lemmyPosts;
var disableKeys = true;
var currentRank;

window.addEventListener('load', async function () {

  console.log("page is fully loaded");
  await StartState();
  await SetDisplay();
});

async function StartState() {
    lemmyPosts = await LoadPosts();

    console.log("LEMMY INIT POSTS : " + lemmyPosts.length);
}

async function LoadPosts() {
    var posts = document.getElementsByClassName(POST);

    console.log("LOAD IMAGE POSTS LENGTH : " + posts.length);

    index = 0;

    return posts;
}

async function GetNextPostWithImage(posts) {
    console.log("GET NEXT POST, INDEX : " + index);
     const indexAtStart = index;

    console.log("START : " + indexAtStart);
    console.log("POSTS LENGTH " + posts.length);
    var imageSrc;
    for (let i = indexAtStart; i < posts.length; i++) {
        for (let j = 0; j < posts[i].childNodes.length; j++) {
            if (posts[i].childNodes[j] != undefined &&
                posts[i].childNodes[j].className == EXPANDO || posts[i].childNodes[j].className == EXPANDO_SPACE) {
                for (let k = 0; k < posts[i].childNodes[j].childNodes.length; k++) {

                    if (posts[i].childNodes[j].childNodes[k] != undefined &&
                        posts[i].childNodes[j].childNodes[k].className == IMAGE &&
                        posts[i].childNodes[j].childNodes[k].childNodes[1] != undefined) {
                        var entry = posts[i].childNodes[j].childNodes[k].childNodes[1];
                        index = i;
                        imageSrc = entry.src;
                    }
                }
            }
        }

        if(imageSrc != undefined)
        {
          for(let j = 0; j < posts[i].childNodes.length; j++){
            if(posts[i].childNodes[j].className == RANK)
            {
              var rank = posts[i].childNodes[j].innerText;
              currentRank = rank;
              if(document.getElementById(`imagePost${rank}`) == undefined){
              posts[i].childNodes[j].insertAdjacentHTML( 'beforeend', await GetUniquePostIdElement(rank));
            }

              return {
                rank: rank,
                imageSrc: imageSrc
              };
            }
          }
        }

    }

    console.log("No image found at index " + index + ", returning nill");

    //No image found, reset index to post limit

    index = posts.length - 1;

    return null;
}

async function GetPreviousPostWithImage(posts) {
    console.log("GET PREVIOUS POST, INDEX : " + index);

    const indexAtStart = index;

    console.log("START : " + indexAtStart);
    console.log("POSTS LENGTH " + posts.length);
    var imageSrc;
    for (let i = indexAtStart; i >= 0; i--) {
        for (let j = 0; j < posts[i].childNodes.length; j++) {
            if (posts[i].childNodes[j] != undefined &&
                posts[i].childNodes[j].className == EXPANDO || posts[i].childNodes[j].className == EXPANDO_SPACE) {
                for (let k = 0; k < posts[i].childNodes[j].childNodes.length; k++) {

                    if (posts[i].childNodes[j].childNodes[k] != undefined &&
                        posts[i].childNodes[j].childNodes[k].className == IMAGE &&
                        posts[i].childNodes[j].childNodes[k].childNodes[1] != undefined) {
                        var entry = posts[i].childNodes[j].childNodes[k].childNodes[1];
                        index = i;
                        imageSrc = entry.src;
                    }
                }
            }
        }

        if(imageSrc != undefined)
        {
          for(let j = 0; j < posts[i].childNodes.length; j++){
            if(posts[i].childNodes[j].className == RANK)
            {
              var rank = posts[i].childNodes[j].innerText;
              currentRank = rank;
              if(document.getElementById(`imagePost${rank}`) == undefined){
              posts[i].childNodes[j].insertAdjacentHTML( 'beforeend', await GetUniquePostIdElement(rank));
            }

              return {
                rank: rank,
                imageSrc: imageSrc
              };
            }
          }
        }

    }

    console.log("No image found at index " + index + ", returning nill");

    //No image found, reset to 0 index

    index = 0;

    return null;
}

async function GetNextPageUrl()
{
  var pager = document.getElementsByClassName(PAGER);
  var nextPageUrl;
  for(let i = 0; i < pager[0].childNodes.length; i++){
    var element = pager[0].childNodes[i];
    if(element.innerText != undefined &&
       element.innerText.includes(NEXT))
       {
         nextPageUrl = element.href;
         break;
       }
  }

  return nextPageUrl;
}

async function GetPreviousPageUrl()
{
  var pager = document.getElementsByClassName(PAGER);
  var nextPageUrl;
  for(let i = 0; i < pager[0].childNodes.length; i++){
    var element = pager[0].childNodes[i];
    if(element.innerText != undefined &&
       element.innerText.includes(PREV))
       {
         nextPageUrl = element.href;
         break;
       }
  }

  return nextPageUrl;
}

function GoToPage(page)
{
  window.location.href = page;
}

async function FlipKeyReading()
{
  disableKeys = !disableKeys;

  console.log("DISABLE KEY VALUE : " + disableKeys);
}

//#region input
//Key down function listener :
$(document).keydown(async function(keyPress) {

  if(keyPress.keyCode == ESCAPE_KEY)
  {
    console.log("ESCAPE KEY PRESS");
    if(disableKeys){
      await ShowCurrentImage(currentRank);
      await FlipKeyReading();
      return;
    }

    await HideCurrentImage(currentRank);
    await FlipKeyReading();
    history.replaceState({}, document.title, ".");
    return;
  }

    if(disableKeys)
    {
      console.log("KEY READING DISABLED " + disableKeys);
      //Key reading disabled
      return;
    }

    console.log("Key press" + keyPress.keyCode);
    var imageSrc;
    var rank;
    if (keyPress.keyCode == W_KEY) {

        console.log("W Key press");
        console.log("LEMMY POSTS LENGTH : " + lemmyPosts.length);
        await HideCurrentImage(currentRank);
        index++;
        result = await GetNextPostWithImage(lemmyPosts);

        console.log("RESULT : " + result);


        if (result != null) {
          console.log("IMAGE SRC : " + result.imageSrc);
          imageSrc = result.imageSrc;
          rank = result.rank;
        }

        SendImageToDisplay(imageSrc, rank);

        return;
    } else if (keyPress.keyCode == S_KEY) {
        console.log("S Key press");
        console.log("LEMMY POSTS LENGTH : " + lemmyPosts.length);
        await HideCurrentImage(currentRank);
        index--;
        result = await GetPreviousPostWithImage(lemmyPosts);
        if(result != null){
          imageSrc = result.imageSrc;
          rank = result.rank;
          console.log("IMAGE SRC : " + result.imageSrc);
        }

        SendImageToDisplay(imageSrc, rank);

        return;
    }else if (keyPress.keyCode == SPACE_BAR)
    {
      //Move on to next page
      var nextPageUrl = await GetNextPageUrl();
      GoToPage(nextPageUrl);
    }else if(keyPress.keyCode == SHIFT)
    {
      //Move back to previous page
      var previousPageUrl = await GetPreviousPageUrl();
      GoToPage(previousPageUrl);
    }

    return;
});

//#endregion

//#region : display

function SetDisplay() {
    var $input = $('<div class="buttons" id="base"></div>');
    $input.prependTo($("body"));

    $("#base").after("<div id=\"imageView\" ></div>");
}

//Given the image url, send to display
async function SendImageToDisplay(imageSrc, rank) {
    if (imageSrc == undefined) {
        return;
    }

    if(rank == undefined)
    {
      rank = lemmyPosts.length-1;
      currentRank = rank;
    }

    console.log("IMAGE SRC SET DISPLAY : "+imageSrc);

    const uniquePostId = await GetUniquePostId(rank);
    const uniqueImagePostId = `imagePost${rank}`;

    //Check if element exists and is hidden, if so show it.
    var element = document.getElementById(uniqueImagePostId);

    if(element != null && element != undefined)
    {
      console.log("Element exists, show : " + uniqueImagePostId);
      ShowCurrentImage(rank);
      window.location.hash = uniquePostId;
      return;
    }

    const post = `<img src=\"${imageSrc}\" class=\"imagePost\" id=\"${uniqueImagePostId}\"></img>`;
    $("#imageView").after(post);
    window.location.hash = uniquePostId;
}

async function HideCurrentImage(rank) {

    if(rank == undefined)
    {
      $(".imagePost").hide();
      return;
    }

    $(`#imagePost${rank}`).hide();
}

async function ShowCurrentImage(rank)
{
  if(rank == undefined)
  {
    result = await GetNextPostWithImage(lemmyPosts);
    if (result != null) {
      console.log("IMAGE SRC : " + result.imageSrc);
      imageSrc = result.imageSrc;
      rank = result.rank;
    }
    SendImageToDisplay(imageSrc, rank);
    return;
  }

    $(`#imagePost${rank}`).show();
}

async function GetUniquePostIdElement(rank)
{
  return `<div class="${PROCESSED_POST}" id="${PROCESSED_POST}${rank}" ></div>`;
}

async function GetUniquePostId(rank)
{
  return `#${PROCESSED_POST}${rank}`;
}

//#endregion
