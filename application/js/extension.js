/* jshint esversion: 8 */
const POST = "post";
const EXPANDO_SPACE = "expando ";
const EXPANDO = "expando";
const EXPANDO_OPEN = "expando open";
const IMAGE = "image";
const RANK = "rank";
const NEXT = "next";
const PREV = "prev";
const PAGER = "pager";
const ENTRY = "entry";
const TITLE = "title";
const PROCESSED_POST = "processedPost";

const ESCAPE_KEY = 27;
const S_KEY = 83;
const W_KEY = 87;
const SHIFT = 16;
const SPACE_BAR = 32;

//Cache Keys
const ACTIVE = "active";

const nextPageWarning = "https://i.imgur.com/rmF0e71.png";

var index = 0;
var lemmyPosts;
var disableKeys = true;
var currentRank;

window.addEventListener('load', async function () {

  console.log("page is fully loaded");
  await StartState();
  await SetDisplay();

  if(localStorage.getItem(ACTIVE) == "true")
  {
    await ShowCurrentImage(currentRank);
    await FlipKeyReading();
  }
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

        imageSrc = await FindImageSrcFromPost(posts[i]);

        if(imageSrc != undefined)
        {

          var titleElement = await GetTitleFromPost(posts[i]);

          for(let j = 0; j < posts[i].childNodes.length; j++){
            if(posts[i].childNodes[j].className == RANK)
            {
              var rank = posts[i].childNodes[j].innerText;
              currentRank = rank;
              if(document.getElementById(`imagePost${rank}`) == undefined){
              titleElement.insertAdjacentHTML( 'beforeend', await GetUniquePostIdElement(rank));
            }
              index = i;
              return {
                rank: rank,
                imageSrc: imageSrc,
                title: titleElement.innerText
              };
            }
          }
        }

    }

    console.log("No image found at index " + index + ", returning nill");

    //No image found, reset index to post limit

    return null;
}

async function GetTitleFromPost(post)
{
  var titleElement;

  for (let j = 0; j < post.childNodes.length; j++) {
      var element = post.childNodes[j];
      if (element != undefined &&
          element.className == ENTRY) {
          for (let k = 0; k < element.childNodes.length; k++) {
            var innerElement = element.childNodes[k];
              if (innerElement != undefined &&
                  innerElement.className == TITLE &&
                  innerElement.childNodes[1] != undefined) {
                  var entry = innerElement.childNodes[1];
                  titleElement = entry;
                  return titleElement;
              }
          }
      }
  }

  return titleElement;
}

async function FindImageSrcFromPost(post)
{
  var imageSrc;
  for (let j = 0; j < post.childNodes.length; j++) {
      var element = post.childNodes[j];
      if (element != undefined &&
          element.className == EXPANDO ||
          element.className == EXPANDO_SPACE ||
          element.className == EXPANDO_OPEN) {
          for (let k = 0; k < element.childNodes.length; k++) {
            var innerElement = element.childNodes[k];
              if (innerElement != undefined &&
                  innerElement.className == IMAGE &&
                  innerElement.childNodes[1] != undefined) {
                  var entry = innerElement.childNodes[1];
                  imageSrc = entry.src;
                  return imageSrc;
              }
          }
      }
  }

  return imageSrc;
}

async function GetPreviousPostWithImage(posts) {
    console.log("GET PREVIOUS POST, INDEX : " + index);

    const indexAtStart = index;

    console.log("START : " + indexAtStart);
    console.log("POSTS LENGTH " + posts.length);
    var imageSrc;
    for (let i = indexAtStart; i >= 0; i--) {

        imageSrc = await FindImageSrcFromPost(posts[i]);

        var titleElement = await GetTitleFromPost(posts[i]);

        if(imageSrc != undefined)
        {
          for(let j = 0; j < posts[i].childNodes.length; j++){
            if(posts[i].childNodes[j].className == RANK)
            {
              var rank = posts[i].childNodes[j].innerText;
              currentRank = rank;
              if(document.getElementById(`imagePost${rank}`) == undefined){
              titleElement.insertAdjacentHTML( 'beforeend', await GetUniquePostIdElement(rank));
            }

              return {
                rank: rank,
                imageSrc: imageSrc,
                title: titleElement.innerText
              };
            }
          }
        }

    }

    console.log("No image found at index " + index + ", returning nill");

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

async function IncreaseIndex()
{
  if(index < lemmyPosts.length)
  {
    index++;
  }
}

async function DecreaseIndex()
{
  if(index > 0)
  {
    index--;
  }
}

//#region input
//Key down function listener :
$(document).keydown(async function(keyPress) {

  if(keyPress.keyCode == ESCAPE_KEY)
  {
    if(localStorage.getItem(ACTIVE) == undefined || localStorage.getItem(ACTIVE) == "true")
    {
    localStorage.setItem(ACTIVE, "false");
  }else {
    localStorage.setItem(ACTIVE, "true");
  }

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
    var title;
    if (keyPress.keyCode == W_KEY) {

        console.log("W Key press");
        console.log("LEMMY POSTS LENGTH : " + lemmyPosts.length);
        await HideCurrentImage(currentRank);
        await IncreaseIndex();
        result = await GetNextPostWithImage(lemmyPosts);

        console.log("RESULT : " + result);


        if (result != null) {
          console.log("IMAGE SRC : " + result.imageSrc);
          imageSrc = result.imageSrc;
          rank = result.rank;
          title = result.title;
        }else {
          ShowCurrentImage(currentRank);
          return;
        }

        SendImageToDisplay(imageSrc, rank, title);

        return;
    } else if (keyPress.keyCode == S_KEY) {
        console.log("S Key press");
        console.log("LEMMY POSTS LENGTH : " + lemmyPosts.length);
        await HideCurrentImage(currentRank);
        await DecreaseIndex();
        result = await GetPreviousPostWithImage(lemmyPosts);
        if(result != null){
          imageSrc = result.imageSrc;
          rank = result.rank;
          title = result.title;
          console.log("IMAGE SRC : " + result.imageSrc);
        }else {
          ShowCurrentImage(currentRank);
          return;
        }

        SendImageToDisplay(imageSrc, rank, title);

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

    $("#base").after("<div id=\"imageView\" class=\"container\" ></div>");
}

//Given the image url, send to display
async function SendImageToDisplay(imageSrc, rank, title) {
    if (imageSrc == undefined) {
        return;
    }

    if(rank == undefined)
    {
      rank = lemmyPosts.length-1;
      currentRank = rank;
    }

    if(title == undefined)
    {
      title = "";
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
    const titlePiece = `<div class="imagePost" id=\"titleOf${uniqueImagePostId}\">${title}</div>`;
    //$("#imageView").after(post);
    var imageViewElement = document.getElementById("imageView");
    imageViewElement.insertAdjacentHTML('beforeend', titlePiece);
    imageViewElement.insertAdjacentHTML('beforeend', post);
    window.location.hash = uniquePostId;
}

async function HideCurrentImage(rank) {

    if(rank == undefined)
    {
      $(".imagePost").hide();
      return;
    }

    const uniqueImagePostId = `imagePost${rank}`;

    $(`#${uniqueImagePostId}`).hide();
    $(`#titleOf${uniqueImagePostId}`).hide();
}

async function ShowCurrentImage(rank)
{
  var imageSrc;
  var title;
  if(rank == undefined)
  {
    result = await GetNextPostWithImage(lemmyPosts);
    if (result != null) {
      console.log("IMAGE SRC : " + result.imageSrc);
      imageSrc = result.imageSrc;
      rank = result.rank;
      title = result.title;
    }
    SendImageToDisplay(imageSrc, rank, title);
    return;
  }

  const uniqueImagePostId = `imagePost${rank}`;

  $(`#${uniqueImagePostId}`).show();
  $(`#titleOf${uniqueImagePostId}`).show();
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
