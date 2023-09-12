var bets = [];//arr of all players bets and bet amounts
//holds all bank information including bet amount and total, reveals methods for bank
var bank = (function(){
  var total = 100;
  var betAmount = 1;
  var currentWager = 0;
  
  function addTotal(num){
    total += num;
  }
  
  function subTotal(){
    total -= betAmount;
  }
  
  function incBet(){
    betAmount++;
  }
  
  function decBet(){
    if(betAmount > 1){
      betAmount--;
    }
  }
  
  function getTotal(){
    return total;
  }
  
  function getBet(){
    return betAmount;
  }
  
  function incWager(){
    currentWager += betAmount;
  }
  
  function getCurrentWager(){
    return currentWager;
  }
  
  function resetCW(){
    currentWager = 0;
  }
  
  return {
    addWinning: addTotal,
    removeBet: subTotal,
    getTotal: getTotal,
    incBet: incBet,
    decBet: decBet,
    getBet: getBet,
    incWager: incWager,
    getCurrentWager: getCurrentWager,
    resetCurrentWager: resetCW
  }
})();
//events to add bets and spin, change bet amount
$('area').on('click', function(event){
  control.result.html("");
  control.payout.html("");
  if(bank.getTotal() >= bank.getBet()){
      let bet = $(this).attr("value");
    //need to add bet amount to each bet
    //console.log(bet);
    bets = bets.concat(recordBets(bet));
    //console.log(bets);
    addChip(event);
    bank.removeBet();
    control.total.val(bank.getTotal());
    bank.incWager();
    control.currentBet.val(bank.getCurrentWager());
  } else {
    $("#nsf").removeClass("hidden");
  }

})

$("#nsf-ok").click(function(e){
  e.preventDefault();
  //console.log("ok");
  $("#nsf").addClass("hidden");
})

$("#spin-wheel").on('click', function(){
  var result = spinWheel();
  //console.log("winning number is " + result);
  console.log(bets);
  let payout = payoutBets(bets,result);
  $("#result").html("The winning number was " + result + ".");
  
  if(payout === 0){
    control.payout.html("Sorry, you lost!");
  } else{
    control.payout.html("You won " + payout + "!");
    bank.addWinning(payout);
    let total = bank.getTotal();
    control.total.val(total);
    
  }
  
  bets.length = 0;
  $(".chip").remove();
  bank.resetCurrentWager();
  control.currentBet.val(bank.getCurrentWager());
})

$("#inc-bet").on('click', function(){
  bank.incBet();
  control.betAmount.val(bank.getBet);
})

$("#dec-bet").on('click', function(){
  bank.decBet();
  control.betAmount.val(bank.getBet);
})

//adds bets to bet arr and calculates payout based on odds
function recordBets(bet){
  let nums = [];
  let payout;
  let betAmount = bank.getBet();
  //convert string value of bet to an array of bets
  switch(bet){
    case "Odd": 
      nums = [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35];
      break;
    case "Even":
      nums = [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36];
      break;
    case "Red":
      nums = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
      break;
    case "Black":
      nums = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];
      break;
    case "1 Col":
      nums = [1,4,7,10,13,16,19,22,25,28,31,34];
      break;
    case "2 Col":
      nums = [2,5,8,11,14,17,20,23,26,29,32,35];
      break;   
    case "3 Col":
      nums = [3,6,9,12,15,18,21,24,27,30,33,36];
      break;
    case "0-00-1-3":
      nums = [0,"00",1,2,3];
      break;
    case "00":
      nums = ["00"];
    default:
      var re = new RegExp("-");
      
      if(bet.match(re)){
        
        let num1 = bet.split("-")[0];
        let num2 = bet.split("-")[1];
        for (let i = num1; i <= num2; i++){
          nums.push(i);
        }              
      } else {
        nums = bet.split(",");
      }
   }
  //returns payout based on number of numbers in a bet
  switch(nums.length){
    case 1:
      payout = 36;
      break;
    case 2:
      payout = 18;
      break;
    case 3:
      payout = 12;
      break;
    case 4:
      payout = 9;
      break;
    case 5:
      payout = 7;
      break;
    case 6:
      payout = 6;
      break;
    case 12:
      payout = 3;
      break;
    case 18:
      payout = 2;
      break;
  }
  nums = nums.map(function(num){ return num.toString(); });
  let bets = [];
  for(let i = 0; i < nums.length; i++){
    //returns array of bet number, payout multiplier, and bet amount
    bets.push([nums[i],payout,betAmount]);
  }
  
  return bets;
}

//return a random result from 0 (including 00) through 36
function spinWheel(){
  let result = Math.floor(Math.random()*38)+1;
  if(result === 37){
    return "0";
  } else if(result === 38){
    return "00";
  } else {
    return result.toString();
  }
}

function payoutBets(bets,result){
  return bets.reduce(function(total,bet){
    if(bet[0] === result){
      let betAmount = bet[2];
      total+=(bet[1]*betAmount);
    }
    //console.log('total',total);
    return total;
  },0);
}

function addChip(event){
  let x = event.pageX;
  let y = event.pageY;
  let board = $('#board');
  var offset = board.offset();
  x -= offset.left +5;
  y -= offset.top +5;
  //console.log([x,y]);
  let chip = $("<div></div>");
  chip.addClass("chip");
  chip.css({
    'position':'absolute',
    'top':y,
    'left':x,
    'width':'10px',
    'height':'10px',
    'border-radius':'50%',
    'background':'yellow'
  })
  board.append(chip);
}

var control = {};
control.total = $("#total");
control.betAmount = $("#bet-amount");
control.currentBet = $("#current-bet");
control.result = $("#result");
control.payout = $("#payout");

control.total.val(bank.getTotal());
control.betAmount.val(bank.getBet);



