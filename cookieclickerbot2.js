var Bot = {};

Bot.save = "";

Bot.loadGame = false;
Bot.clickCookie = true;
Bot.clickGoldenCookies = true;
Bot.castSpells = false;
Bot.buyUpgrades = false;
Bot.buyBuildings = false;

Bot.storeCookies = true;
Bot.storedCookies = 0;

Bot.targetBuilding = 0;
Bot.nextBuy = 0;
Bot.findNextBuy = function()
{
  if(Game.ObjectsById[Bot.targetBuilding].amount == 0){
    var highcps = Game.ObjectsById[Bot.targetBuilding].baseCps*Game.globalCpsMult;
  }else{
    var highcps = Game.ObjectsById[Bot.targetBuilding].storedTotalCps/Game.ObjectsById[Bot.targetBuilding].amount*Game.globalCpsMult;
  }

  for(var i=0;i<=Bot.targetBuilding;i++)
  {
    var lowcps = Game.ObjectsById[i].storedTotalCps/Game.ObjectsById[i].amount*Game.globalCpsMult;
    var cpsratio = highcps/lowcps;
    var targetprice = Game.ObjectsById[Bot.targetBuilding].price/cpsratio;
    if(i == Bot.targetBuilding || Game.ObjectsById[i].price <= targetprice)
    {
      Bot.nextBuy = i;
      break;
    }
  }
}

Bot.PlayGame = function()
{
  if(Bot.clickCookie){Game.ClickCookie();}

  for(var i=0;Bot.clickGoldenCookies && i<Game.shimmers.length;i++)
  {
    if(Game.shimmers[0].type == "golden" ? Game.shimmers[i].wrath == 0 : true)
    {
      Game.shimmers[i].pop();
      break;
    }
  }

  if(Bot.castSpells && Game.shimmers.length == 0 && Game.ObjectsById[7].minigame.magic >= Game.ObjectsById[7].minigame.magicM)
  {
    Game.ObjectsById[7].minigame.castSpell(Game.ObjectsById[7].minigame.spellsById[1]);
  }

  if(Bot.buyUpgrades && Game.UpgradesInStore.length > 0 && Game.cookies >= Game.UpgradesInStore[0].basePrice + (Bot.storeCookies ? Bot.storedCookies : 0))
  {
    //Game.UpgradesInStore[2].click();
  }

  Bot.findNextBuy();
  Bot.storedCookies = Game.cookiesPsRaw * 42000;
  if(Bot.buyBuildings && Game.cookies >= Game.ObjectsById[Bot.nextBuy].price + (Bot.storeCookies ? Bot.storedCookies : 0))
  {
    Game.ObjectsById[Bot.nextBuy].buy();
    if(Bot.nextBuy < 17 && Bot.nextBuy == Bot.targetBuilding){Bot.targetBuilding++;}
  }
}

Bot.StartPlaying = function()
{
  if(Bot.loadGame){Game.ImportSaveCode(Bot.save);}
  for(var i=0;i<=17;i++)
  {
    Bot.targetBuilding = i;
    if(Game.ObjectsById[i].amount == 0){break;}
  }
  Bot.loopInterval = setInterval(Bot.PlayGame, 100);
}
Bot.StopPlaying = function(){clearInterval(Bot.loopInterval);}
