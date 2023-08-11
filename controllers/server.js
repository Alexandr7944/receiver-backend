const fs = require('fs');

const dateNow = new Date().toLocaleDateString('ru-RU', {year: 'numeric', month: 'numeric'});

const getAll = (req, res) => {
  fs.readFile('db/receiver.json', 'utf8', (err, data) => {
    if (err) throw err;
    res.status(200).send(data);
  })
};

const last = (req, res) => {
  fs.readFile('db/receiver.json', 'utf8', (err, data) => {
    if (err) throw err;
    let lastData = JSON.parse(data).at(-1);
    lastData = lastData.date === dateNow 
      ? lastData 
      : {...lastData, receiver: lastData.receiver.map(i => ({ ...i, payment: 0 }))};

    res.status(200).send(lastData);
  })
};

const newReceiver = (req, res) => {
  const {body} = req;

  fs.readFile('db/receiver.json', 'utf8', (err, oldReceiver) => {
    if (err) throw err;
    const data = JSON.parse(oldReceiver);
    const index = data.findIndex(i => i.date === dateNow);

    const lastData = (index === -1) ? data[data.length - 1].receiver : data[index - 1].receiver;

    const newData = {
      ...body,
      receiver: body.receiver.map((item, index) => {
        const resWater = (item.water - lastData[index].water) * body.priceWater;
        const resEnergy = (item.energy - lastData[index].energy) * body.priceEnergy;
        const debt = Number((lastData[index].amount - item.payment).toFixed(2));
        const amount = Number((debt + resWater + resEnergy + item.housePayment).toFixed(2));

        return { ...item, debt, amount };
      })
    };

    index === -1
      ? data.push({ ...newData, date: dateNow })
      : data[index] = ({ ...newData, date: dateNow });

    const updatedData = JSON.stringify(data);
    
    fs.writeFile('db/receiver.json', updatedData, 'utf8', () => {
      if (err) throw err;
      res.status(202).json(updatedData);
    })
  })
};

module.exports = {
  getAll, last, newReceiver
}