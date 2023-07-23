/* jshint esversion: 8 */
const POST = "post";
const EXPANDO = "expando ";
const IMAGE = "image";
const RANK = "rank";

const ESCAPE_KEY = 27;
const S_KEY = 83;
const W_KEY = 87;

const nextPageWarning = "https://i.imgur.com/rmF0e71.png";

var index = 0;
var lemmyPosts;
var disableKeys = true;
var currentRank;

window.onload = (event) => {
    console.log("page is fully loaded");

    StartState();
    SetDisplay();
};

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

    if (index != 0) {
        index = index + 1; //Move forward, curr is already displayed
    }

    const indexAtStart = index;

    console.log("START : " + indexAtStart);
    console.log("POSTS LENGTH " + posts.length);
    var imageSrc;
    for (let i = indexAtStart; i < posts.length; i++) {
        for (let j = 0; j < posts[i].childNodes.length; j++) {
            if (posts[i].childNodes[j] != undefined &&
                posts[i].childNodes[j].className == EXPANDO) {
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

    if (index != 0) {
        index = index - 1; //Move backward, curr is already displayed
    }

    const indexAtStart = index;

    console.log("START : " + indexAtStart);
    console.log("POSTS LENGTH " + posts.length);
    var imageSrc;
    for (let i = indexAtStart; i >= 0; i--) {
        for (let j = 0; j < posts[i].childNodes.length; j++) {
            if (posts[i].childNodes[j] != undefined &&
                posts[i].childNodes[j].className == EXPANDO) {
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

function SetDisplay() {
    var $input = $('<input type="button" value="Base" class="buttons" id="base" /input>');
    $input.prependTo($("body"));

    $("#base").after("<div id=\"imageView\" ></div>");
}

//Given the image url, send to display
function SendImageToDisplay(imageSrc, rank) {
    if (imageSrc == undefined) {
        return;
    }

    if(rank == undefined)
    {
      rank = lemmyPosts.length-1;
    }

    console.log("IMAGE SRC : "+imageSrc);

    const post = `<img src=\"${imageSrc}\" class=\"imagePost\" id=\"imagePost${rank}\">"`;
    $("#imageView").after(post);
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
    $(".imagePost").show();
    return;
  }

    $(`#imagePost${rank}`).show();
}

async function FlipKeyReading()
{
  disableKeys = !disableKeys;

  console.log("DISABLE KEY VALUE : " + disableKeys);
}

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

    await HideCurrentImage();
    await FlipKeyReading();
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
        result = await GetNextPostWithImage(lemmyPosts);

        console.log("RESULT : " + result);


        if (result == null) {
            imageSrc = nextPageWarning;
        }else {
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
        result = await GetPreviousPostWithImage(lemmyPosts);
        if(result != null){
          imageSrc = result.imageSrc;
          rank = result.rank;
          console.log("IMAGE SRC : " + result.imageSrc);
        }

        SendImageToDisplay(imageSrc, rank);

        return;
    }

    return;
});
