var body = document.getElementById('body'),
    gridHolder = document.getElementById("gridHolder"),
    grid = document.getElementById('grid'),
    staging = document.getElementById("staging"),
    showCount = 0,
    currentTarget,
    currentTargetRect,
    offset = gridHolder.getBoundingClientRect(),
    dx,
    dy,
    monday = new Date();

monday.setHours(0, 0, 0, 0);

gridHolder.addEventListener("mousedown", selectBlock);
document.getElementById("addShow").addEventListener("click", addShow);

function addShow() {
    showCount++;

    var id = "radioShow-" + showCount, showBar = document.createElement("div");
    showBar.setAttribute("id", id);
    showBar.setAttribute("class", "radio-show color-one");

    staging.appendChild(showBar);

}

function selectBlock(event) {
    if (!hasClass(event.target, 'radio-show')) {
        return;
    }
    var x = event.pageX,
        y = event.pageY;
    currentTarget = event.target;
    currentTargetRect = currentTarget.getBoundingClientRect();
    dx = x - currentTargetRect.left + offset.left;
    dy = y - currentTargetRect.top + offset.top;
    body.addEventListener('mousemove', moveBlock);
    body.addEventListener('mouseup', dropBlock);
}

function moveBlock() {
    var x = event.pageX,
        y = event.pageY;
    currentTarget.style.left = (x - dx) + "px";
    currentTarget.style.top = (y - dy) + "px";
}

function dropBlock() {
    var blockBounds;
    if (isInGridBounds(currentTarget)) {
        grid.appendChild(currentTarget);
        snapBlock(currentTarget);
        blockBounds = currentTarget.getBoundingClientRect();
        leftDateTime = pixelsToTime(blockBounds.left);
        rightDateTime = pixelsToTime(blockBounds.right);
        date = pixelsToDate(blockBounds.top);
        currentTarget.innerHTML = "<p>" + date +"<p>" + leftDateTime + '–' + rightDateTime;
    } else {
        currentTarget.remove();
    }
    body.removeEventListener('mousemove', moveBlock);
    body.removeEventListener('mouseup', dropBlock);
}

function hasClass(element, className) {
    return element.className.indexOf(className) != -1;
}

function isInGridBounds(element) {
    var bounds = grid.getBoundingClientRect();
    currentTargetBounds = element.getBoundingClientRect();
    return !(currentTargetBounds.left < bounds.left || currentTargetBounds.top < bounds.top);
}

function snapBlock(element) {
    var left, top,
        snapToLeft = 12,
        snapToTop = 44;
    currentTargetBounds = element.getBoundingClientRect();

    left = currentTargetBounds.left - offset.left;
    top = currentTargetBounds.top - offset.top;
    if (left % snapToLeft != 0) {
        element.style.left = Math.floor(left - (left % snapToLeft)) + "px";
    }
    if (top % snapToTop != 0) {
        element.style.top = Math.floor(top - (top % snapToTop)) + "px";
    }
}

function pixelsToTime(sidePosition) {
    var fiveMinutes = 12,
        minutes,
        dateTime = new Date(monday),
        formattedTime; // pixel width of five min interval

    minutes = Math.round((sidePosition - offset.left) / fiveMinutes) * 5;
    dateTime.setMinutes(minutes);

    formattedTime = padZeroes(dateTime.getHours()) + ':' + padZeroes(dateTime.getMinutes());
    return formattedTime;
}

function pixelsToDate(top) {
    var day = 44,
        dateTime = new Date(monday),
        formattedDate; // pixel width of five min interval
    day = Math.round((top - offset.top)/day);
    console.log("day", day);
    dateTime.setHours(day*24);

    formattedDate = dateTime.getFullYear() + "-" + padZeroes(dateTime.getMonth()+1) + "-" + padZeroes(dateTime.getDate());
    return formattedDate;
}

function padZeroes(n) {
    return (n < 10) ? ("0" + n) : n;
}