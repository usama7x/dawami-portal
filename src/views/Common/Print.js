import React, { useState, useEffect, useCallback, memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CustomIconButton from '../Common/CustomIconButton';
import { appCache} from '../../utils/Common.js';
const styles = {
    printFrame: {
        position: "fixed",
        left: "0",
        right: "0",
        top: "0",
        bottom: "0",
        backgroundColor: "#fff",
        width: "100%",
        zIndex: "1111",
        height: "100%",
        margin: "auto",
        overflow: "scroll"
    },
    printBody: {
        width: "800px",
        margin: "20px auto"
    }
}
const useStyles = makeStyles(styles);
const Print = memo(({ elementRef, hiddenCol, name}) => {
    console.log("elementRef", elementRef)
    debugger;
    const classes = useStyles();
    const [showPrintView, setPrintView] = useState(false);

    const printData = () => {
        const divToPrint = elementRef.innerHTML;
        let newWin = window.open("","",`width=${window.screen.width},height=${window.screen.height},titlebar=0,toolbar=no,fullscreen=yes`);
        let hiddenColumnCss = "";
        let nameHtml = "";
        let today = new Date();
        let title = appCache('orgName')+today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
        let style = `
        <style>
            html,td,tr {
                text-align: left;
            }
            html {
                font-family: Arial, Helvetica, sans-serif;
                border-collapse: collapse;
                width: 100%;
              }
              
              td, th {
                border: 1px solid #ddd;
                padding: 8px;
              }
              
              tr:nth-child(even){background-color: #f2f2f2;}
              
              tr:hover {background-color: #ddd;}
              
              th {
                padding-top: 12px;
                padding-bottom: 12px;
                text-align: left;
                color: #3c3131;
    background-color: #f2f2f2;
              }
        </style>
        `;
        if(hiddenCol && hiddenCol != -1) {
            hiddenColumnCss = `
            <style>
            td:nth-of-type(${hiddenCol+1}), th:nth-of-type(${hiddenCol+1}) {

              display: none;
              
              }
            </style>
      `;
        }
        if(name) {
            nameHtml = `<h1>${name}</h1>`;
        }
        let script = `
        <script>
            function runMe() {
                console.log("printttt")
                window.print();
                window.close();
            }
            window.onload = runMe;
            window.onload = (event) => {
                console.log("printttt")
            }
            console.log("run")
            window.print();
                window.close();
        </script>
        `
        newWin.document.write(
            title  + style + hiddenColumnCss + nameHtml + divToPrint + script
            );
        // newWin.print();
        // newWin.close();
    }
    return (
        <CustomIconButton color="invert" className={classes.positionRight} icon="print" title={"Print"} onClick={printData} />
    )
})

export default Print;