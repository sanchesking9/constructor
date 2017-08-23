export function clipByName(ctx, frame) {
  this.setCoords();
  var clipRect = frame;
  var scaleXTo1 = (1 / this.scaleX);
  var scaleYTo1 = (1 / this.scaleY);
  ctx.save();

  var ctxLeft = -( this.width / 2 ) + clipRect.strokeWidth;
  var ctxTop = -( this.height / 2 ) + clipRect.strokeWidth;
  var ctxWidth = clipRect.width - clipRect.strokeWidth;
  var ctxHeight = clipRect.height - clipRect.strokeWidth;

  ctx.translate( ctxLeft, ctxTop );

  ctx.rotate(degToRad(this.angle * -1));
  ctx.scale(scaleXTo1, scaleYTo1);
  ctx.beginPath();
  ctx.rect(
    clipRect.left - this.oCoords.tl.x,
    clipRect.top - this.oCoords.tl.y,
    clipRect.width,
    clipRect.height
  );
  ctx.closePath();
  ctx.restore();

  function degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }
}

export function debounce(func, ms) {
  let timeOutId;

  return function () {
    clearTimeout(timeOutId);

    timeOutId = setTimeout(() => {
      func.apply(this, arguments);
    }, ms);
  }
}
