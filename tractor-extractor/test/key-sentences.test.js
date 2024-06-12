const weightKeySentences = require("../src/key-sentences").weightKeySentences;
let fs = require("fs");
let content2 = fs.readFileSync(__dirname + "/input/test2.txt", 'utf8');
content2 = content2.replace(/<[^>]*>/g, " ").replaceAll("\n", " ")


test('top sentences textrank',async ()=>{

		let summary_obj = weightKeySentences(content2,5);


		// console.log(summary_obj.join("\n\n"))
		console.log(JSON.stringify(summary_obj, null, 2)	);

		fs.writeFileSync(__dirname + "/summary.json", JSON.stringify(summary_obj, null, 2));
		expect(typeof(summary_obj)).toBe('object');

})
