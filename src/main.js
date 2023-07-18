//進捗バー，GPAの表示
document.getElementById("bar").style.display = "none";
document.getElementById("GPA").style.display = "none";
//各学部学科の卒業要件単位 = [教養必修, 教養選択, 専門必修, 専門選択, 選択共通, 随意科目]
var tanni = {
  zyouhou: [10, 16, 48, 40, 10, 0],
  keizai: [14, 16, 26, 52, 16, 0],
};
//データ表示
var Flg = 0;
function mainDataProcessAndDisplay(data) {
  if (Flg == 0) {
    makeTableAndBar(data);
    Flg = 1;
  } else if (Flg == 1) {
    reset();
    for (var i = 0; i < 4; i++) $("#curriculum").find("tr").slice(i).remove();
    makeTableAndBar(data);
  }
}
var GPAData = [];
//GPAを管理する関数
function GPADataProcess(data) {
  for (var i = 1; i < data.tables.length; i++)
    GPAData.push(Number(data.tables[i][1]));
  console.log(GPAData);
  document.getElementById("GPA").style.display = "block";
  document.getElementById("GPATitle").innerHTML =
    "通算GPA(" + GPAData[GPAData.length - 1] + "/4.0)";
  document.getElementById("barGPA").value = GPAData[GPAData.length - 1];
}
//テーブル生成
var kyoyoHissyu = 0;
var kyoyoSentaku = 0;
var senmonHissyu = 0;
var senmonSentaku = 0;
var sentakuKyotu = 0;
var zuiiKamoku = 0;
var gokeiTanni = 0;
var GraduationSum = 0;
var EarnedCreditsSum = 0;
var TakingCoursesCreditsSum = 0;
var sintyokuData = [];
var EarnedCreditsData = [];
var TakingCoursesCreditsData = [];
var tanniTmp = [];
function makeTableAndBar(data) {
  EarnedCreditsData = [
    Number(data[1].split("\n")[1]),
    Number(data[1].split("\n")[2]),
    Number(data[1].split("\n")[17]),
    Number(data[1].split("\n")[18]),
  ];
  TakingCoursesCreditsData = [
    Number(data[3].split("\n")[1]),
    Number(data[3].split("\n")[2]),
    Number(data[3].split("\n")[17]),
    Number(data[3].split("\n")[18]),
  ];

  if (data[1].split("\n").length == 28) {
    //情報工学科
    tanniTmp = tanni.zyouhou;
    EarnedCreditsData.push(Number(data[1].split("\n")[24]));
    EarnedCreditsData.push(Number(data[1].split("\n")[25]));
    TakingCoursesCreditsData.push(Number(data[1].split("\n")[24]));
    TakingCoursesCreditsData.push(Number(data[1].split("\n")[25]));
  } else if (data[1].split("\n").length == 34) {
    //経済学部
    tanniTmp = tanni.keizai;
    EarnedCreditsData.push(Number(data[1].split("\n")[30]));
    EarnedCreditsData.push(Number(data[1].split("\n")[31]));
    TakingCoursesCreditsData.push(Number(data[1].split("\n")[30]));
    TakingCoursesCreditsData.push(Number(data[1].split("\n")[31]));
  } else {
    alert("このPDFファイルは読み込めません．");
    window.location.href = window.location.href;
  }

  console.log(data[1].split("\n"));
  for (var i = 0; i < tanniTmp.length; i++) {
    GraduationSum = GraduationSum + tanniTmp[i];
    EarnedCreditsSum = EarnedCreditsSum + EarnedCreditsData[i];
    TakingCoursesCreditsSum =
      TakingCoursesCreditsSum + TakingCoursesCreditsData[i];
  }

  console.log(tanniTmp);

  tanniTmp.push(GraduationSum);
  EarnedCreditsData.push(EarnedCreditsSum);
  TakingCoursesCreditsData.push(TakingCoursesCreditsSum);

  let table = document.createElement("table");
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");
  table.appendChild(thead);
  table.appendChild(tbody);

  document.getElementById("curriculum").appendChild(table);
  let row_1 = document.createElement("tr");
  let heading_1 = document.createElement("th");
  heading_1.innerHTML = "科目分類";
  let heading_2 = document.createElement("th");
  heading_2.innerHTML = "教養必修";
  let heading_3 = document.createElement("th");
  heading_3.innerHTML = "教養選択";
  let heading_4 = document.createElement("th");
  heading_4.innerHTML = "専門必修";
  let heading_5 = document.createElement("th");
  heading_5.innerHTML = "専門選択";
  let heading_6 = document.createElement("th");
  heading_6.innerHTML = "選択共通	";
  let heading_7 = document.createElement("th");
  heading_7.innerHTML = "随意科目";
  let heading_8 = document.createElement("th");
  heading_8.innerHTML = "合計単位	";

  row_1.appendChild(heading_1);
  row_1.appendChild(heading_2);
  row_1.appendChild(heading_3);
  row_1.appendChild(heading_4);
  row_1.appendChild(heading_5);
  row_1.appendChild(heading_6);
  row_1.appendChild(heading_7);
  row_1.appendChild(heading_8);
  thead.appendChild(row_1);

  let row_2 = document.createElement("tr");
  let row_2_data_1 = document.createElement("td");
  row_2_data_1.innerHTML = "卒業要件単位";
  let row_2_data_2 = document.createElement("td");
  row_2_data_2.innerHTML = tanniTmp[0];
  let row_2_data_3 = document.createElement("td");
  row_2_data_3.innerHTML = tanniTmp[1];
  let row_2_data_4 = document.createElement("td");
  row_2_data_4.innerHTML = tanniTmp[2];
  let row_2_data_5 = document.createElement("td");
  row_2_data_5.innerHTML = tanniTmp[3];
  let row_2_data_6 = document.createElement("td");
  row_2_data_6.innerHTML = tanniTmp[4];
  let row_2_data_7 = document.createElement("td");
  row_2_data_7.innerHTML = tanniTmp[5];
  let row_2_data_8 = document.createElement("td");
  row_2_data_8.innerHTML = tanniTmp[6];

  row_2.appendChild(row_2_data_1);
  row_2.appendChild(row_2_data_2);
  row_2.appendChild(row_2_data_3);
  row_2.appendChild(row_2_data_4);
  row_2.appendChild(row_2_data_5);
  row_2.appendChild(row_2_data_6);
  row_2.appendChild(row_2_data_7);
  row_2.appendChild(row_2_data_8);
  tbody.appendChild(row_2);

  let row_3 = document.createElement("tr");
  let row_3_data_1 = document.createElement("td");
  row_3_data_1.innerHTML = "修得済単位";
  let row_3_data_2 = document.createElement("td");
  row_3_data_2.innerHTML = EarnedCreditsData[0];
  let row_3_data_3 = document.createElement("td");
  row_3_data_3.innerHTML = EarnedCreditsData[1];
  let row_3_data_4 = document.createElement("td");
  row_3_data_4.innerHTML = EarnedCreditsData[2];
  let row_3_data_5 = document.createElement("td");
  row_3_data_5.innerHTML = EarnedCreditsData[3];
  let row_3_data_6 = document.createElement("td");
  row_3_data_6.innerHTML = EarnedCreditsData[4];
  let row_3_data_7 = document.createElement("td");
  row_3_data_7.innerHTML = EarnedCreditsData[5];
  let row_3_data_8 = document.createElement("td");
  row_3_data_8.innerHTML = EarnedCreditsData[6];

  row_3.appendChild(row_3_data_1);
  row_3.appendChild(row_3_data_2);
  row_3.appendChild(row_3_data_3);
  row_3.appendChild(row_3_data_4);
  row_3.appendChild(row_3_data_5);
  row_3.appendChild(row_3_data_6);
  row_3.appendChild(row_3_data_7);
  row_3.appendChild(row_3_data_8);
  tbody.appendChild(row_3);

  let row_4 = document.createElement("tr");
  let row_4_data_1 = document.createElement("td");
  row_4_data_1.innerHTML = "履修中単位";
  let row_4_data_2 = document.createElement("td");
  row_4_data_2.innerHTML = TakingCoursesCreditsData[0];
  let row_4_data_3 = document.createElement("td");
  row_4_data_3.innerHTML = TakingCoursesCreditsData[1];
  let row_4_data_4 = document.createElement("td");
  row_4_data_4.innerHTML = TakingCoursesCreditsData[2];
  let row_4_data_5 = document.createElement("td");
  row_4_data_5.innerHTML = TakingCoursesCreditsData[3];
  let row_4_data_6 = document.createElement("td");
  row_4_data_6.innerHTML = TakingCoursesCreditsData[4];
  let row_4_data_7 = document.createElement("td");
  row_4_data_7.innerHTML = TakingCoursesCreditsData[5];
  let row_4_data_8 = document.createElement("td");
  row_4_data_8.innerHTML = TakingCoursesCreditsData[6];

  row_4.appendChild(row_4_data_1);
  row_4.appendChild(row_4_data_2);
  row_4.appendChild(row_4_data_3);
  row_4.appendChild(row_4_data_4);
  row_4.appendChild(row_4_data_5);
  row_4.appendChild(row_4_data_6);
  row_4.appendChild(row_4_data_7);
  row_4.appendChild(row_4_data_8);
  tbody.appendChild(row_4);

  let row_5 = document.createElement("tr");
  let row_5_data_1 = document.createElement("td");
  row_5_data_1.innerHTML = "不足単位";
  let row_5_data_2 = document.createElement("td");
  row_5_data_2.innerHTML =
    tanniTmp[0] - EarnedCreditsData[0] - TakingCoursesCreditsData[0];
  let row_5_data_3 = document.createElement("td");
  row_5_data_3.innerHTML =
    tanniTmp[1] - EarnedCreditsData[1] - TakingCoursesCreditsData[1];
  let row_5_data_4 = document.createElement("td");
  row_5_data_4.innerHTML =
    tanniTmp[2] - EarnedCreditsData[2] - TakingCoursesCreditsData[2];
  let row_5_data_5 = document.createElement("td");
  row_5_data_5.innerHTML =
    tanniTmp[3] - EarnedCreditsData[3] - TakingCoursesCreditsData[3];
  let row_5_data_6 = document.createElement("td");
  row_5_data_6.innerHTML =
    tanniTmp[4] - EarnedCreditsData[4] - TakingCoursesCreditsData[4];
  let row_5_data_7 = document.createElement("td");
  row_5_data_7.innerHTML =
    tanniTmp[5] - EarnedCreditsData[5] - TakingCoursesCreditsData[5];
  let row_5_data_8 = document.createElement("td");
  row_5_data_8.innerHTML =
    tanniTmp[6] - EarnedCreditsData[6] - TakingCoursesCreditsData[6];

  var row_5_data_tmp = [
    row_5_data_1,
    row_5_data_2,
    row_5_data_3,
    row_5_data_4,
    row_5_data_5,
    row_5_data_6,
    row_5_data_7,
    row_5_data_8,
  ];
  for (var j = 0; j < 8; j++) {
    if (j > 0) {
      if (
        tanniTmp[j - 1] -
          EarnedCreditsData[j - 1] -
          TakingCoursesCreditsData[j - 1] ==
        0
      )
        row_5_data_tmp[j].style.backgroundColor = "green";
      else row_5_data_tmp[j].style.backgroundColor = "hotpink";
    }
    row_5.appendChild(row_5_data_tmp[j]);
  }
  tbody.appendChild(row_5);

  bar();
}
//進捗バーの表示
var progressData = 0;
function bar() {
  for (var i = 0; i < 6; i++) {
    progressData =
      Math.round(
        ((100 * (EarnedCreditsData[i] + TakingCoursesCreditsData[i])) /
          tanniTmp[i]) *
          100
      ) / 100;
    if (progressData > 100 || isNaN(progressData) == true) progressData = 100;
    sintyokuData.push(progressData);
  }
  sintyokuData.push(
    Math.round(
      (100 * sintyokuData.reduce((sum, element) => sum + element, 0) * 100) /
        600
    ) / 100
  );

  document.getElementById("bar").style.display = "block";
  document.getElementById("barTitle1").innerHTML =
    "教養必修(" + sintyokuData[0] + "%)";
  document.getElementById("barTitle2").innerHTML =
    "教養選択(" + sintyokuData[1] + "%)";
  document.getElementById("barTitle3").innerHTML =
    "専門必修(" + sintyokuData[2] + "%)";
  document.getElementById("barTitle4").innerHTML =
    "専門選択(" + sintyokuData[3] + "%)";
  document.getElementById("barTitle5").innerHTML =
    "選択共通(" + sintyokuData[4] + "%)";
  document.getElementById("barTitle6").innerHTML =
    "随意科目(" + sintyokuData[5] + "%)";
  document.getElementById("barTitle7").innerHTML =
    "合計単位(" + sintyokuData[6] + "%)";

  document.getElementById("bar1").value = sintyokuData[0];
  document.getElementById("bar2").value = sintyokuData[1];
  document.getElementById("bar3").value = sintyokuData[2];
  document.getElementById("bar4").value = sintyokuData[3];
  document.getElementById("bar5").value = sintyokuData[4];
  document.getElementById("bar6").value = sintyokuData[5];
  document.getElementById("bar7").value = sintyokuData[6];
}
//変数を初期化する関数．
function reset() {
  kyoyoHissyu = 0;
  kyoyoSentaku = 0;
  senmonHissyu = 0;
  senmonSentaku = 0;
  sentakuKyotu = 0;
  zuiiKamoku = 0;
  gokeiTanni = 0;
  GraduationSum = 0;
  EarnedCreditsSum = 0;
  progressData = 0;
  TakingCoursesCreditsSum = 0;
  GPAData.length = 0;
  EarnedCreditsData.length = 0;
  TakingCoursesCreditsData.length = 0;
  sintyokuData.length = 0;
  tanniTmp.pop();
}
