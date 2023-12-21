export {};

enum Gender {
  Boy = 1,
  Giry = 0,
  Weizhi = -1,
}
enum Gender2 {
  Boy, //0
  Giry, //1
  Weizhi, //2
}
const query = {
  name: 'Jordan',
  gender: Gender.Boy,
};
const query2 = {
  name: 'Jordan2',
  gender: Gender.Giry,
};

console.log('query----->', query);
console.log('query2----->', query2);
