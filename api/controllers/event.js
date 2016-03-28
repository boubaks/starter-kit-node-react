var events = [
  {
    title: 'TomorrowLand',
    cover: 'http://cdn.99scenes.com/wp-content/uploads/2016/01/tomorrowland-2016.jpg',
    _id: 1,
    description: ''
  },
  {
    title: 'Fashion Week',
    cover: 'http://www.legorafac.fr/wp-content/uploads/2014/11/fashion-sebag.png',
    _id: 2,
    description: ''
  },
  {
    title: 'Roland Garros',
    cover: 'http://tennishighlights.eu/wp-content/uploads/2014/05/Roland-Garros-Court-Philippe-Chatrier.jpg',
    _id: 3,
    description: ''
  }
];

exports.get = function(req, res) {
  res.send(events);
};