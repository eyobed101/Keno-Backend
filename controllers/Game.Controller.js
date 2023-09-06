import Game from "../models/games";
import Cashier from "../models/cashier";

let g_NumberOfGame = 0;
let CondtionOfHighWin = false;
let g_Capital = 0;
let g_Parameter = 0;
let g_WindFall = 0;
let g_newParameter = 0;
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

  // condition to check whether this particular game is first time ever, in order to determine the initialized values

  // get the database value of those value

  // MainAccount = MainAccountData[0].value;
  // MoneyInShop = MoneyInShopData[0].value;
  // UnclaimedMoney = UnclaimedMoneyData[0].value;

  // Start to accept the request and begin to process a single game
  g_NumberOfGame = NumberOfGame;
  g_Capital = Capital;
  g_Parameter = Parameter;
  g_WindFall = Windfall;

  try {
    const Tickets = await req.body.tickets; // receving the tickets to be processed
    tickets = Tickets; // duplicate these ticket values for important purpose
    console.log("Tickets", Tickets);

    // check whether these particular game send no tickets so that no alter will happen
    if (!Tickets || Tickets.length < 1)
      return res.status(201).json("Not sucessful");

    // let getTotalMoneyCollected = totalMoneyCollected(Tickets); // getting total money callected from each ticket
    // let selectedNumbers = AllSelectedNumbers(Tickets); // all selected numbers in the game from total of 80 choice

    let rand = allLuckyNumbers(1, 80, 20); // generate random 20 numbers
    let random = [...new Set(rand)];

    while (random.length < 20) {
      let number = allLuckyNumbers(1, 80, 1);
      if (random.includes(number[0])) {
        void 0;
      } else {
        random.push(number[0]);
      }
    }

    U_selectedNumbersInTickets = SelectedNumbersUnion(Tickets);
    U_unSelectedNumbersInTickets = UnselectedNumbersUnion(
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
    { $set: { windfall: g_Parameter } } // Set the parameter field to the new value
  );
};



// All Selected Numbers in The Tickets function
const AllSelectedNumbers = (tickets) => {
  let AllNumbersInTickets = [];
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