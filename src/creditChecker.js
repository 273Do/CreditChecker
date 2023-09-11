var drop = document.getElementById("drop");
function handleDrop(e) {
  $("#json-result").text("Transfering file...");
  e.stopPropagation();
  e.preventDefault();
  var files = e.dataTransfer.files;
  var f = files[0];
  {
    var reader = new FileReader();
    var name = f.name;
    reader.onload = function (e) {
      var data = e.target.result;
      $("#json-result").text("Parsing PDF...");
      parse_content(data); //btoa(arr));
    };
    reader.readAsArrayBuffer(f);
  }
}

function handleFile(e) {
  $("#json-result").text("Transfering file...");
  var files = e.target.files;
  var f = files[0];
  {
    var reader = new FileReader();
    var name = f.name;
    reader.onload = function (e) {
      var data = e.target.result;
      $("#json-result").text("Parsing PDF...");
      parse_content(data); //btoa(arr));
    };
    reader.readAsArrayBuffer(f);
  }
}
document
  .getElementById("pdf-file")
  .addEventListener("change", handleFile, false);

function handleDragover(e) {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
}

if (drop.addEventListener) {
  drop.addEventListener("dragenter", handleDragover, false);
  drop.addEventListener("dragover", handleDragover, false);
  drop.addEventListener("drop", handleDrop, false);
}

//
// If absolute URL from the remote server is provided, configure the CORS
// header on that server.
//

var array_to_csv = function (tables) {
  return tables
    .map(function (rows) {
      return rows
        .map(function (v) {
          if ("undefined" === typeof v || v === null) {
            return v;
          }
          if (v.indexOf('"')) {
            v = v.replace(/"/g, '""');
          }
          if (
            v.indexOf('"') >= 0 ||
            v.indexOf("\n") >= 0 ||
            v.indexOf(",") >= 0
          ) {
            v = '"' + v + '"';
          }
          return v;
        })
        .join(",");
    })
    .join("\n");
};
$("#csv-select").change(function () {
  $("#csv-result").val(
    array_to_csv($("#csv-select option:selected").data("data").tables)
  );
});

pdf_table_extractor_progress = function (result) {
  $("#json-result").text(
    "Parsing PDF, progress: " +
      result.currentPages +
      " / " +
      result.numPages +
      " pages"
  );
};

var parse_content = function (content) {
  PDFJS.workerSrc = "../src/pdf.worker.js";
  // PDFJS.cMapUrl = "/cmaps/";
  // PDFJS.cMapPacked = true;

  PDFJS.getDocument(content)
    .then(pdf_table_extractor)
    .then(function (result) {
      // JSON output
      document.getElementById("json-result").innerText = JSON.stringify(result);
      console.log(result.pageTables[result.currentPages - 1].tables);
      var mainData = result.pageTables[result.currentPages - 1].tables[0];
      var GPAData = result.pageTables[result.currentPages - 3];
      mainDataProcessAndDisplay(mainData);
      // console.log(result.pageTables[result.currentPages - 6].tables);
      console.log(result.pageTables[0]);
      GPADataProcess(GPAData);
      // const fileName = document.getElementById("pdf-file").files[0];
      // console.log(fileName.name);
      // HTML output
      // CSV output
      $("#csv-select").html("");
      $("#html-result").html("");

      var all_tables = [];
      while ((page_tables = result.pageTables.shift())) {
        if (
          !$('input:checkbox[name="merge-table"]').is(":checked") &&
          !$('input:checkbox[name="merge-table-remove-first-line"]').is(
            ":checked"
          )
        ) {
          $("#html-result").append(
            $("<h3 id= 'sub-table'></h3>").text("Page " + page_tables.page)
          );
        }

        $("#csv-select").append(
          $("<option></option>")
            .text("Page " + page_tables.page)
            .data("data", page_tables)
        );
        if (
          $('input:checkbox[name="merge-table-remove-first-line"]').is(
            ":checked"
          ) &&
          page_tables.page > 1
        ) {
          all_tables = all_tables.concat(page_tables.tables.slice(1));
        } else {
          all_tables = all_tables.concat(page_tables.tables);
        }
        //table_dom = $("<table></table>").attr("border", 1);
        if (result.pageTables == 0)
          table_dom = $("<table id= 'sub-table'></table>").attr("border", 1);
        else table_dom = $("<table id= 'sub-table'></table>").attr("border", 1);
        var tables = page_tables.tables;
        var merge_alias = page_tables.merge_alias;
        var merges = page_tables.merges;

        for (var r = 0; r < tables.length; r++) {
          if (
            $('input:checkbox[name="merge-table-remove-first-line"]').is(
              ":checked"
            ) &&
            page_tables.page != 1 &&
            r == 0
          ) {
            continue;
          }
          tr_dom = $("<tr></tr>");
          for (var c = 0; c < tables[r].length; c++) {
            r_c = [r, c].join("-");
            if (merge_alias[r_c]) {
              continue;
            }

            td_dom = $("<td></td>");
            if (merges[r_c]) {
              if (merges[r_c].width > 1) {
                td_dom.attr("colspan", merges[r_c].width);
              }
              if (merges[r_c].height > 1) {
                td_dom.attr("rowspan", merges[r_c].height);
              }
            }
            td_dom.text(tables[r][c]);
            tr_dom.append(td_dom);
          }
          table_dom.append(tr_dom);
        }
        $("#html-result").append(table_dom);
      }
      $("#csv-select").append(
        $("<option></option>").text("all").data("data", { tables: all_tables })
      );
      $("#csv-select").change();
    });
};
