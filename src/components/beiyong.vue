<template>
  <div class="contents">
    <div class="lefttop1-title">区域</div>
      <img id="police" src="'../../static/shougang1.svg'" style="display:none;"  width="395px" height="343px">
       <div id="contentMap" style="width: 100%;height: 95%;">
       <canvas id="areaCanvas" width="395px" height="343px" style="width:90%;height:90%;margin-left:20px;"></canvas>
    </div>
  </div>
</template>
<script>
  //vue中点在不规则图形中的判断
var inside = require( 'point-in-polygon' );
// import {generatePolygon} from '../api/index.js'
export default {
  data () {
    return {
      collectionArr: [],
    }
  },
  mounted () {
    generatePolygon().then(response => {
      this.collectionArr = response.data
      this.drawPolygons()
    });
  },
  methods: {
    drawPolygons: function () {
      var canvas = document.getElementById( 'areaCanvas' )
       if ( null == canvas || !canvas.getContext ) 
         return
       var ctx = canvas.getContext( "2d" )
       var  img=document.getElementById("police")
       if (img.complete) {
          ctx.drawImage(img, 0, 0);
        } else {
          img.onload = function() {
            ctx.drawImage(img, 0, 0)
          }
        }
        this.canvasMousemoveEvent( canvas, ctx );
        this.canvasClickEvent( canvas );
    },
    canvasMousemoveEvent: function ( canvas, ctx ) {
      var _this = this;
      canvas.onmousemove = function ( e ) {
         _this.clearPolygon(ctx,canvas)
         var location = _this.getLocation( canvas, e.clientX, e.clientY )
          _this.drawPolygonByPoint( ctx, location, e ,canvas)
      }
    },
    canvasClickEvent: function ( canvas ) {
      var _this = this
      canvas.onclick = function ( e ) {
        var location = _this.getLocation( canvas, e.clientX, e.clientY )
        var count = 0
         _this.collectionArr.map( obj => {
           var pointsArr = obj.polygon
           count++
           if ( location != null && inside( location, pointsArr ) == true ) {
              alert(obj.name)
            }
        } )
      }
    },
    drawPolygonByPoint: function ( ctx, location, e ,canvas) {
       this.clearTitle()
       this.collectionArr.map( obj => {
         var pointsArr = obj.polygon
         if ( location != null && inside( location, pointsArr ) == true ) {
            this.drawHighLightPolygon( ctx, pointsArr,canvas )
            this.displayTitle(e,obj.name)
          }
        } )
    },
    clearTitle: function () {
      var div = document.getElementById( 'title' )
      if ( div != null ) {
        document.body.removeChild(div)
      }
    },
    displayTitle: function ( e ,name) {
      var div = document.createElement( "div" )
      div.setAttribute( "id", "title" )
      div.style.position = "absolute"
      div.style.left = e.clientX + 10 + "px"
      div.style.top = e.clientY + "px"
      div.innerText = name
      div.style.backgroundColor = "gray"
      div.style.zIndex = "9999"
      document.body.appendChild( div )
      },
      drawHighLightPolygon: function ( ctx, pointsArr ,canvas) {
        ctx.beginPath()
        for ( let i = 0; i < pointsArr.length; i++ ) {
          var pointX = Math.round(canvas.width * pointsArr[ i ][ 0 ])+1
          var pointY = Math.round(canvas.height * pointsArr[ i ][ 1 ])+1
          ctx.lineWidth=2
          if ( i == 0 ) {
            ctx.moveTo( pointX, pointY)
            } else if ( i < pointsArr.length - 1 ) {
              ctx.lineTo( pointX, pointY )
            } else {
              ctx.lineTo( pointX, pointY)
              ctx.strokeStyle = "#FF7F00"
              ctx.closePath()
              ctx.stroke()
            }
          }
        },
        clearPolygon: function(ctx,canvas){
          ctx.clearRect( 0, 0, canvas.width, canvas.height )
          var  img=document.getElementById("police")
          ctx.drawImage(img, 0, 0)
        },
        getLocation: function ( canvas, x, y ) {
          var bbox = canvas.getBoundingClientRect()
          return [ ( x - bbox.left ) * ( canvas.width / bbox.width )/canvas.width, ( y - bbox.top ) * ( canvas.height / bbox.height )/canvas.height ]
        }
      }
    }

</script>

<style scoped>

    .contents {

      float: left;

      height: 98.5%;

      width: 41.3%;

      border: 1px solid rgba(15, 208, 198, 0.50);

      box-shadow: inset 0 2px 19px 0 rgba(15, 208, 198, 0.80);

      margin-left: 1.4%;

      margin-right: 1.4%;

    }

    .lefttop1-title{

      text-align: center;

      color: #0FD0C6;

      font-size: 12px;

      /* background: url(../assets/Group.png) no-repeat; */

      width: 170px;

      line-height: 25px;

      display: inline-block;

    }

</style>