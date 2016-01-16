// module.exports = {
// 	getElement: function(el, arr) {
// 		for (var i = 0; i < arr.length; i++) {
// 			if (arr[i].id === el) {
// 				return (i); }
// 		}
// 	},
// 	parseGoings: function(gArr, fCurrentGoing) {
// 		// If anyone's going
// 		if (gArr) {
// 			var s = '';
// 			// How many are going?
// 			var count = gArr.length;
//
// 			// Only me
// 			if (count < 1 && fCurrentGoing) {
// 				return 'You are going';
// 			}
// 			// One person, not me, is going
// 			if (count === 1 && !fCurrentGoing) {
// 				return gArr[0].user_firstName + ' is going';
// 			}
// 			// Two people, including me, are going
// 			if (count === 1 && fCurrentGoing) {
// 				return gArr[0].user_firstName + ' and you are going';
// 			}
// 			if (count === 2) {
// 				if (fCurrentGoing) {
// 					return gArr[0].user_firstName + ', ' + gArr[1].user_firstName + ' and you are going';
// 				} else {
// 					return gArr[0].user_firstName + ' and ' + gArr[1].user_firstName + ' are going';
// 				}
// 			}
// 			// More people, build string
// 			if (count > 2) {
// 				s = gArr[0].user_firstName + ', ' + gArr[1].user_firstName;
// 				s += fCurrentGoing ? ', you ' : '';
// 				s += ' and ' + (count - 2) + ' more are going';
// 				return s;
// 			}
// 		} else {
// 			return '';
// 		}
// 	}
// };
