/* jshint esversion: 8 */
const POST = "post";
const EXPANDO = "expando ";
const IMAGE = "image";

const ESCAPE_KEY = 27;
const S_KEY = 83;
const W_KEY = 87;

const nextPageWarning = "https://i.imgur.com/rmF0e71.png";

var index = 0;
var lemmyPosts;

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
                        return entry.src;
                    }
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
                        return entry.src;
                    }
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
    var $input = $('<p><input type="button" value="Base" class="buttons" id="base" >');
    $input.prependTo($("body"));

    $("#base").after("<div id=\"imageView\" ></div>");
}

//Given the image url, send to display
function SendImageToDisplay(imageSrc, rank) {
    if (imageSrc == undefined) {
        return;
    }

    const post = `<img src=\"${imageSrc}\" class=\"imagePost\" id=\"imagePost${rank}\">"`;
    $("#imageView").after(post);
}

async function HideCurrentImage() {
    $(".imagePost").hide();
}

//Key down function listener :
$(document).keydown(async function(keyPress) {
    console.log("Key press" + keyPress.keyCode);
    var imageSrc;
    if (keyPress.keyCode == W_KEY) {

        console.log("W Key press");
        console.log("LEMMY POSTS LENGTH : " + lemmyPosts.length);
        await HideCurrentImage();
        imageSrc = await GetNextPostWithImage(lemmyPosts);

        console.log("IMAGE SRC : " + imageSrc);

        if (imageSrc == undefined) {
            imageSrc = nextPageWarning;
        }

        SendImageToDisplay(imageSrc, 0);

        return;
    } else if (keyPress.keyCode == S_KEY) {
        console.log("S Key press");
        console.log("LEMMY POSTS LENGTH : " + lemmyPosts.length);
        await HideCurrentImage();
        imageSrc = await GetPreviousPostWithImage(lemmyPosts);

        console.log("IMAGE SRC : " + imageSrc);

        SendImageToDisplay(imageSrc, 0);

        return;
    }

    return;
});
