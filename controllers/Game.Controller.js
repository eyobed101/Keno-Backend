import Game from "../models/games.js";
import Cashier from "../models/cashier.js";
import { uuid } from 'uuidv4';

let g_NumberOfGame = 0;
let CondtionOfHighWin = false;
let g_Capital = 0;
let g_Parameter = 0;
let g_WindFall = 0;
let g_newParameter = 0;
let g_Profitablility = " ";
let tickets = [];
let U_unSelectedNumbersInTickets = [];
let U_selectedNumbersInTickets = [];
let luckyTicketsId = [];
let luckyTicketIdMulti = [];
let TotalMoneyCollected = 0;
let totalMoneyForLuckyTicket = 0;
let luckyNum = [];
let biggestOdd = 0;
let BigOddTicketsCollection = [];
let winnertickets = [];
let HighOddWinnertickets = [];
let nominatedNumsToBeRemoved = [];
let nominatedNumsToBeRemovedByOdd = [];
let totalMoneyForLuckeyTickets = 0;

let AllNumbersInTickets = [];

export const Draw = async (req, res) => {

  // Find the game related values if there is any past history

  let NumberOfGame = await Cashier.findOne(
    { cashierID: req._id },
    "NumberOfGame"
  );
  let Capital = await Cashier.findOne({ cashierID: req._id }, "capital");
  let Parameter = await Cashier.findOne({ cashierID: req._id }, "parameter");
  let Windfall = await Cashier.findOne({ cashierID: req._id }, "windfall");


  g_NumberOfGame = NumberOfGame;
  g_Capital = Capital;
  g_Parameter = Parameter;
  g_WindFall = Windfall;

  try {
    const Tickets = await req.body.tickets; // receving the tickets to be processed
    tickets = Tickets; // duplicate these ticket values for important purpose

    let NumberOfPlayer = Tickets.length
    if (!Tickets || Tickets.length < 1)
      return res.status(201).json("Not sucessful");


    let rand = RandomNumberGenerator(1, 80, 20); // generate random 20 numbers
    let random = [...new Set(rand)];

    while (random.length < 20) {
      let number = RandomNumberGenerator(1, 80, 1);
      if (random.includes(number[0])) {
        void 0;
      } else {
        random.push(number[0]);
      }
    }

    U_selectedNumbersInTickets = selectedNumbersUnion(Tickets);
    U_unSelectedNumbersInTickets = UnselectedNumbersFun(
      U_selectedNumbersInTickets
    );
    AllSelectedNumbers(Tickets);
    let FinalNumbers = decisionMaker(random, Tickets);

    // res.json(selectedNumbers);
    res.json({ numbers: FinalNumbers, winners: winnertickets });

    // res.status(200).json(random);
  } catch (err) {
    console.log(err);
  }

  await Cashier.findOneAndUpdate(
    { cashierID: req._id }, // Replace cashierId with the actual ID of the cashier you want to update
    { $inc: { NumberOfGame: 1 } } // Increment the NumberOfGame field by 1
  );

  await Cashier.findOneAndUpdate(
    { cashierID: req._id }, // Replace cashierId with the actual ID of the cashier you want to update
    { $set: { capital: g_Capital } } // Set the capital field to the new value
  );

  await Cashier.findOneAndUpdate(
    { cashierID: req._id }, // Replace cashierId with the actual ID of the cashier you want to update
    { $set: { parameter: g_newParameter } } // Set the parameter field to the new value
  );

  await Cashier.findOneAndUpdate(
    { cashierID: req._id }, // Replace cashierId with the actual ID of the cashier you want to update
    { $set: { windfall: g_WindFall } } // Set the parameter field to the new value
  );


  async function createGame() {
    try {
      const newGame = new Game({
        cashierID: req._id,
        gameID: uuid,
        gameNumber: (g_NumberOfGame + 1),
        date: new Date(),
        result: FinalNumbers,
        status: 'Closed',
        profitability: g_Profitablility,
        unclaimedMoney: 0,
        numberOfPlayer: NumberOfPlayer,
        winner: winnerTickets.map(({ ticket, win }) => ({ id: ticket, amountWon: win })),
      });
  
      await newGame.save();
    } catch (error) {
      console.error('Error saving game:', error);
    }
  }
  
  createGame();

};



// All Selected Numbers in The Tickets function
const AllSelectedNumbers = (tickets) => {
  AllNumbersInTickets = [];
  for (let i = 0; i < tickets.length; i++) {
    for (let j = 0; j < tickets[i].numbers.length; j++) {
      if (Array.isArray(tickets[i].numbers[j])) {
        for (let k = 0; k < tickets[i].numbers[j].length; k++) {
          AllNumbersInTickets.push(tickets[i].numbers[j][k]);
        }
      } else {
        AllNumbersInTickets.push(tickets[i].numbers[j]);
      }
    }
  }
  return AllNumbersInTickets;
};


const totalMoneyCollected = (t) => {
  let total = 0;
  for (let j = 0; j < t.length; j++) {
    if (t[j].type === 1) {
      total = total + t[j].money * t[j].numbers.length;
    } else {
      total = total + t[j].money;
    }
  }
  // MoneyFromBet = total
  return total;
};

const oddGenerator = (totalNumber, luckyNumbers) => {
  if (totalNumber === 1 && luckyNumbers === 1) {
    return 3.8;
  } else if (totalNumber === 2 && luckyNumbers === 2) {
    return 15;
  } else if (totalNumber === 3 && luckyNumbers === 2) {
    return 3;
  } else if (totalNumber === 3 && luckyNumbers === 3) {
    return 35;
  } else if (totalNumber === 4 && luckyNumbers === 2) {
    return 1;
  } else if (totalNumber === 4 && luckyNumbers === 3) {
    return 8;
  } else if (totalNumber === 4 && luckyNumbers === 4) {
    return 100;
  } else if (totalNumber === 4 && luckyNumbers === 3) {
    return 8;
  } else if (totalNumber === 5 && luckyNumbers === 2) {
    return 1;
  } else if (totalNumber === 5 && luckyNumbers === 3) {
    return 3;
  } else if (totalNumber === 5 && luckyNumbers === 4) {
    return 15;
  } else if (totalNumber === 5 && luckyNumbers === 5) {
    return 300;
  } else if (totalNumber === 6 && luckyNumbers === 3) {
    return 1;
  } else if (totalNumber === 6 && luckyNumbers === 4) {
    return 10;
  } else if (totalNumber === 6 && luckyNumbers === 5) {
    return 70;
  } else if (totalNumber === 6 && luckyNumbers === 6) {
    return 1800;
  } else if (totalNumber === 7 && luckyNumbers === 3) {
    return 1;
  } else if (totalNumber === 7 && luckyNumbers === 4) {
    return 6;
  } else if (totalNumber === 7 && luckyNumbers === 5) {
    return 12;
  } else if (totalNumber === 7 && luckyNumbers === 6) {
    return 120;
  } else if (totalNumber === 7 && luckyNumbers === 7) {
    return 2150;
  } else if (totalNumber === 8 && luckyNumbers === 4) {
    return 4;
  } else if (totalNumber === 8 && luckyNumbers === 5) {
    return 8;
  } else if (totalNumber === 8 && luckyNumbers === 6) {
    return 68;
  } else if (totalNumber === 8 && luckyNumbers === 7) {
    return 600;
  } else if (totalNumber === 8 && luckyNumbers === 8) {
    return 3000;
  } else if (totalNumber === 9 && luckyNumbers === 4) {
    return 3;
  } else if (totalNumber === 9 && luckyNumbers === 5) {
    return 6;
  } else if (totalNumber === 9 && luckyNumbers === 6) {
    return 18;
  } else if (totalNumber === 9 && luckyNumbers === 7) {
    return 120;
  } else if (totalNumber === 9 && luckyNumbers === 8) {
    return 1800;
  } else if (totalNumber === 9 && luckyNumbers === 9) {
    return 4200;
  } else if (totalNumber === 10 && luckyNumbers === 4) {
    return 2;
  } else if (totalNumber === 10 && luckyNumbers === 5) {
    return 4;
  } else if (totalNumber === 10 && luckyNumbers === 6) {
    return 12;
  } else if (totalNumber === 10 && luckyNumbers === 7) {
    return 40;
  } else if (totalNumber === 10 && luckyNumbers === 8) {
    return 400;
  } else if (totalNumber === 10 && luckyNumbers === 9) {
    return 2500;
  } else if (totalNumber === 10 && luckyNumbers === 10) {
    return 5000;
  } else {
    return 0;
  }
};


const RandomNumberGenerator = (min, max, n = 1) =>
  Array.from(
    { length: n },
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );

const selectedNumbersUnion = (tickets) => {
  for (let i = 0; i < tickets.length; i++) {
    for (let j = 0; j < tickets[i].numbers.length; j++) {
      if (Array.isArray(tickets[i].numbers[j])) {
        for (let k = 0; k < tickets[i].numbers[j].length; k++) {
          if (!U_selectedNumbersInTickets.includes(tickets[i].numbers[j][k])) {

            U_selectedNumbersInTickets.push(tickets[i].numbers[j][k]);
          }
        }
      } else if (!U_selectedNumbersInTickets.includes(tickets[i].numbers[j])) {
        U_selectedNumbersInTickets.push(tickets[i].numbers[j]);
      }
    }
  }
  return U_selectedNumbersInTickets;
};

const UnselectedNumbersFun = (numbers) => {
  for (let i = 1; i < 81; i++) {
    if (!numbers.includes(i)) {
      U_unSelectedNumbersInTickets.push(i);
    }
  }
  return U_unSelectedNumbersInTickets;
};

const random_item = (items) => {
  return items[Math.floor(Math.random() * items.length)];
};

const elementCount = (arr, element, type) => {
  if (type === 0) {
    return arr.filter((currentElement) => currentElement === element).length;
  } else {
    return arr.filter(
      (currentElement) =>
        currentElement.id === element.id &&
        currentElement.index === element.index
    ).length;
  }
};

const totalMoneyAssignForGame = (tic) => {
  let divider = 0;
  let MainAccountNow = 0;

  let getTotalMoneyCollected = totalMoneyCollected(tic);

  g_newParameter = 15 * +g_NumberOfGame + 5000 + 300 * Math.cos(5 * +g_NumberOfGame);

  divider = +g_newParameter - +g_Parameter;

  let multiplier = 0;
  let TransMoney = 0;

  if (divider < 0) {
    
    multiplier = g_newParameter / +g_Parameter;

    if (multiplier > 0.6) {
      multiplier = 0.6;
    }

    TransMoney = multiplier * getTotalMoneyCollected;

    let randomLuckeyNumber = Math.floor(Math.random() * 3) + 1;


    if (g_WindFall > 0 && randomLuckeyNumber === 2) {
      CondtionOfHighWin = true;
      TotalMoneyCollected =
        getTotalMoneyCollected + g_WindFall + TransMoney;
      g_WindFall = 0;
    } else {
      TotalMoneyCollected = getTotalMoneyCollected + TransMoney;
      g_Profitablility = "Loss"

    }

    MainAccountNow = g_Capital - TransMoney;
    g_Capital = MainAccountNow;

  } else if (divider > 0) {
    multiplier = +g_Parameter / g_newParameter;
    if (multiplier > 0.6) {
      multiplier = 0.6;
    }
    TransMoney = multiplier * getTotalMoneyCollected;

    TotalMoneyCollected = getTotalMoneyCollected - TransMoney;

    MainAccountNow = g_Capital + TransMoney;

    g_Profitablility = "Gain"


    g_Capital = MainAccountNow;

  } else {
    TotalMoneyCollected = getTotalMoneyCollected;
  }


  return TotalMoneyCollected;
};


const mode = (array) => {
  if (array.length === 0) return null;
  var modeMap = {};
  var maxEl = array[0],
    maxCount = 1;
  for (var i = 0; i < array.length; i++) {
    var el = array[i];
    if (modeMap[el] == null) modeMap[el] = 1;
    else modeMap[el]++;
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return maxEl;
};


const getSingleTicketMoney = (rand, tic) => {
  totalMoneyForLuckyTicket = 0;

  nominatedNumsToBeRemoved = [];

  nominatedNumsToBeRemoved = mode(AllNumbersInTickets);

  var Odd = 0;
  luckyTicketsId = [];
  luckyTicketIdMulti = [];
  for (let i = 0; i < rand.length; i++) {
    for (let k = 0; k < tic.numbers.length; k++) {
      if (Array.isArray(tic.numbers[k])) {
        for (let j = 0; j < tic.numbers[k].length; j++) {
          if (rand[i] === tic.numbers[k][j]) {
            if (!luckyNum.includes(tic.numbers[k][j])) {
              luckyNum.push(tic.numbers[k][j]);
            }
            luckyTicketIdMulti.push({ id: tic.id, index: k });
          }
        }
      } else if (rand[i] === tic.numbers[k]) {
        if (!luckyNum.includes(tic.numbers[k])) {
          luckyNum.push(tic.numbers[k]);
        }
        luckyTicketsId.push(tic.id);
      }
    }
  }

  if (tic.type === 1) {
    for (let i = 0; i < tic.numbers.length; i++) {
      Odd = oddGenerator(
        tic.numbers[i].length,
        elementCount(luckyTicketIdMulti, { id: tic.id, index: i }, 1)
      );

      if (Odd > 0) {
        winnertickets.push({ ticket: tic.id, win: Odd * tic.money });
      }

      if (Odd > 1) {
        HighOddWinnertickets.push({ ticket: tic.id, odd: Odd });
      }

      totalMoneyForLuckyTicket = totalMoneyForLuckyTicket + tic.money * Odd;

      if (Odd > biggestOdd) {
        biggestOdd = Odd;
        nominatedNumsToBeRemovedByOdd = luckyNum.filter((x) =>
          tic.numbers[i].includes(x)
        );
      }
    }
  } else {
    Odd = oddGenerator(
      tic.numbers.length,
      elementCount(luckyTicketsId, tic.id, 0)
    );

    if (Odd > 0) {
      winnertickets.push({ ticket: tic.id, win: Odd * tic.money });
    }

    if (Odd > 1) {
      HighOddWinnertickets.push({ ticket: tic.id, odd: Odd });
    }


    totalMoneyForLuckyTicket = tic.money * Odd;


    if (Odd > biggestOdd) {
      biggestOdd = Odd;
      nominatedNumsToBeRemovedByOdd = luckyNum.filter((x) =>
        tic.numbers.includes(x)
      );
    }
  }

  return totalMoneyForLuckyTicket;
};


const getTotalMoneyForAllLuckyTickets = (rand, tics) => {
  winnertickets = [];
  totalMoneyForLuckeyTickets = 0;
  for (let i = 0; i < tics.length; i++) {
    totalMoneyForLuckeyTickets =
      totalMoneyForLuckeyTickets + getSingleTicketMoney(rand, tics[i]);

  }

  return totalMoneyForLuckeyTickets;
};


const remover = (rand, num) => {
  let NumRemoved = num[num.length - 1];
  let newRandom = [];
  for (let i = 0; i < rand.length; i++) {
    if (rand[i] !== NumRemoved) {
      newRandom.push(rand[i]);
    }
  }


  let itration = 20 - newRandom.length;

  if (U_unSelectedNumbersInTickets.length !== 0) {
    let value = U_unSelectedNumbersInTickets[0];
    for (let i = 0; i < itration; i++) {
      if (!newRandom.includes(U_unSelectedNumbersInTickets[i])) {
        newRandom.push(U_unSelectedNumbersInTickets[i]);
      }
    }

    U_unSelectedNumbersInTickets = U_unSelectedNumbersInTickets.filter(function (item) {
      return item !== value;
    });

  } else {
    while (newRandom.length < 20) {
      let itr = random_item(getRandNoDup);

      if (!newRandom.includes(itr)) {
        newRandom.push(itr);
        getRandNoDup = getRandNoDup.filter(function (item) {
          return item !== itr;
        });
      }
    }
  }

  luckyNum = [];
  biggestOdd = 0;
  winnertickets = [];
  decisionMaker(newRandom, tickets);
};

// DoHighWinner is a function to slecte optimized random numbers that resembles to one high winner

const DoHighWinner = (rand, tic, totalAssignedMoney) => {
  let MoneyBetByWinner = 0;
  let NumberIntheBet = 0;
  let SizeOfTicket = tic.length;

  let randomLuckeyNumber = Math.floor(Math.random() * SizeOfTicket) + 1;

  let HighWinnerToBe = tic[randomLuckeyNumber - 1];
  MoneyBetByWinner = HighWinnerToBe.money;

  if (HighWinnerToBe.type === 1) {
    let RandomArrayFromMltiple =
      Math.floor(Math.random() * HighWinnerToBe.numbers.length) + 1;
    let theArray = HighWinnerToBe.numbers[RandomArrayFromMltiple];

    NumberIntheBet = theArray.length;

    let NumberOfLuckeyNumbersToBe = 0;

    for (let i = NumberIntheBet; i > 0; i--) {
      if (
        oddGenerator(NumberIntheBet, i) * MoneyBetByWinner >
        totalAssignedMoney
      ) {
      } else {
        NumberOfLuckeyNumbersToBe = i;
        break;
      }
    }


    for (let i = 0; i < NumberOfLuckeyNumbersToBe; i++) {

      const randomIndex = Math.floor(Math.random() * rand.length);
      rand.splice(randomIndex, 1);
    }


    for (let i = 0; i < NumberOfLuckeyNumbersToBe; i++) {
      for (let j = 0; j < U_selectedNumbersInTickets.length; j++) {
        if (
          !rand.includes(U_selectedNumbersInTickets[j]) &&
          theArray.includes(U_selectedNumbersInTickets[j])
        ) {
          rand.push(U_selectedNumbersInTickets[j]);
          break;
        }
      }
    }
  } else {
    NumberIntheBet = HighWinnerToBe.numbers.length;

    let NumberOfLuckeyNumbersToBe = 0;

    for (let i = NumberIntheBet; i > 0; i--) {
      if (
        oddGenerator(NumberIntheBet, i) * MoneyBetByWinner >
        totalAssignedMoney
      ) {
      } else {
        NumberOfLuckeyNumbersToBe = i;
        break;
      }
    }

    for (let i = 0; i < NumberOfLuckeyNumbersToBe; i++) {

      const randomIndex = Math.floor(Math.random() * rand.length);
      rand.splice(randomIndex, 1);
    }


    for (let i = 0; i < NumberOfLuckeyNumbersToBe; i++) {
      for (let j = 0; j < U_selectedNumbersInTickets.length; j++) {
        if (
          !rand.includes(U_selectedNumbersInTickets[j]) &&
          HighWinnerToBe.numbers.includes(U_selectedNumbersInTickets[j])
        ) {
          rand.push(U_selectedNumbersInTickets[j]);
          break;
        }
      }
    }
  }


  let itration = 20 - rand.length;

  if (itration !== 0) {
    if (U_unSelectedNumbersInTickets.length !== 0) {
      let value = U_unSelectedNumbersInTickets[0];
      for (let i = 0; i < itration; i++) {
        if (!rand.includes(U_unSelectedNumbersInTickets[i])) {
          rand.push(U_unSelectedNumbersInTickets[i]);
        }
      }
    }
  }

  return rand;
};


const decisionMaker = (rand, tic) => {
  var totalLuckyMoney = getTotalMoneyForAllLuckyTickets(rand, tic);

  var totalAssignedMoney = totalMoneyAssignForGame(tic);

  if (CondtionOfHighWin) {
    let highWinnerRand = DoHighWinner(rand, tic, totalAssignedMoney);
    g_Profitablility = "Win"
    return highWinnerRand;
  } else {

    if (totalLuckyMoney > totalAssignedMoney) {
      HighOddWinnertickets = [];
      winnertickets = [];
      remover(rand, nominatedNumsToBeRemovedByOdd);
    } else {
      g_WindFall = g_WindFall + (totalAssignedMoney - totalLuckyMoney);
    }
    return rand;
  }
};