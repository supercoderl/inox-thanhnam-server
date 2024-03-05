import { Skeleton, TableCell, TableRow } from "../../../node_modules/@mui/material/index";

const TableRowsLoader = ({ rowsNum, colsNum }) => {
    return [...Array(rowsNum)].map((row, index) => (
        <TableRow key={index}>
            <TableCell component="th" scope="row">
                <Skeleton animation="wave" variant="text" />
            </TableCell>
            {
                [...Array(colsNum)].map((col, index) => (
                    <TableCell key={index}>
                        <Skeleton animation="wave" variant="text" />
                    </TableCell>
                ))
            }
        </TableRow>
    ));
};

export default TableRowsLoader;