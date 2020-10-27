import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import rest from "./Rest";
import LinearProgress from "@material-ui/core/LinearProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {Grid} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";


function descendingComparator(a, b, orderBy) {

    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;

}

function getComparator(order, orderBy) {

    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);

}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);

        return order === 0
            ? a[1] - b[1]
            : order

    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {id: 'publisher', label: 'Publisher'},
    {id: 'name', label: 'Domain'},
    {id: 'assets', label: 'assets name'},
    {id: 'app_ads', label: 'app-ads.txt entries'},
    {id: 'ads', label: 'ads.txt entries'},
];

function EnhancedTableHead(props) {
    const {classes, order, orderBy, onRequestSort} = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={"keyfortablehead;oitv" + headCell.label}
                        align={headCell.label === 'Publisher' ? 'left' : 'center'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id
                                ? <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
                                : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    title: {
        flex: '1 1 100%',
    },
    grid: {
        margin: '1rem'
    }
}));

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

export const Reports = ({setRoute}) => {

    const classes = useStyles();
    const [rows, setRows] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('publisher');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false)
    const [isFSO, setFSO] = useState(true)
    const [filterPublisher, setFilterPublisher] = useState('')
    const [filterDomain, setFilterDomain] = useState('')
    const [filterAsset, setFilterAsset] = useState('')


    useEffect(() => {

        setLoading(true)

        rest('crawls')
            .then(res => {

                setLoading(false)

                if (res.status === 200) {

                    setRows(res.body)

                    console.log(res.body)

                }

            })

    }, [])

    const EnhancedTableToolbar = () => {
        const classes = useToolbarStyles();

        return <>

            <Toolbar
                className={clsx(classes.root)}
            >
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                    Reports
                </Typography>

                <Tooltip title="Filter list">
                    <IconButton
                        onClick={_ => setFSO(!isFSO)}
                    >
                        <FilterListIcon/>
                    </IconButton>
                </Tooltip>
            </Toolbar>

            {isFSO
                ? <Grid
                    container
                    className={(classes.grid)}
                    spacing={1}
                >
                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <InputLabel>Select publisher...</InputLabel>

                            <Select
                                fullWidth
                                value={filterPublisher}
                                onChange={e => setFilterPublisher(e.target.value)}
                            >
                                <MenuItem value={''}>None</MenuItem>
                                {rows.map(r => r.publisher)
                                    .filter((p, i, self) => self.indexOf(p) === i)
                                    .map(p => <MenuItem value={p}>
                                        {p}
                                    </MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <InputLabel>Select domain...</InputLabel>

                            <Select
                                fullWidth
                                value={filterDomain}
                                onChange={e => setFilterDomain(e.target.value)}
                            >
                                <MenuItem value={''}>None</MenuItem>
                                {rows.map(r => r.name)
                                    .filter((d, i, self) => self.indexOf(d) === i)
                                    .map(d => <MenuItem value={d}>
                                        {d}
                                    </MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-helper-label">Select asset...</InputLabel>
                            <Select
                                fullWidth
                                value={filterAsset}
                                onChange={e => setFilterAsset(e.target.value)}
                            >
                                <MenuItem value={''}>None</MenuItem>
                                <MenuItem value={'not exists'}>Not exists</MenuItem>
                                {[].concat(...rows.map(r => r.assets)
                                    .filter(a => a.length > 0)
                                    .map(a => a.map(a => a.asset_name)))
                                    .filter((a, i, self) => self.indexOf(a) === i)
                                    .map(a => <MenuItem value={a}>
                                        {a}
                                    </MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                : null
            }

        </>
    };


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const statuses = [
        {name: 'UNAVAILABLE', color: 'grey'},
        {name: 'ADDED', color: 'green'},
        {name: 'DELETED', color: 'red'},
    ]

    const isNeedDisplay = row => {

        let needDisplay = true;

        if (filterPublisher) {

            needDisplay = filterPublisher === row.publisher

        }

        if (filterDomain) {

            needDisplay = filterDomain === row.name

        }

        if (filterAsset) {

            needDisplay = Boolean(row.assets.find(a => filterAsset === a.asset_name))

        }

        return needDisplay

    }

    const assetsRender = value => value.length === 0
        ? 'not exists'
        : <List>
            {value.map(a => <ListItem key={"assetskeyfowqerg" + a.id}>
                {a.asset_name}
            </ListItem>)}
        </List>

    const entriesRender = value => {

        if (value.length === 0) return 'N/A'

        return <List>
            {value.map(e => {

                let status = statuses[e.status_id]

                return <ListItem
                    key={"entrieskeyforcriwuerbkver" + e.id}
                    style={{
                        backgroundColor: status.color,
                        color: 'white',
                        margin: 0,
                        padding: 0,
                    }}
                >
                    <ListItemText
                        primary={e.entry_name}
                        secondary={status.name + ", add: " + e.created_at + ", upd: " + e.updated_at}
                    />
                </ListItem>
            })}
        </List>

    }

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar/>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {loading
                                ? <TableRow>
                                    <TableCell colSpan={5}>
                                        <LinearProgress/>
                                    </TableCell>
                                </TableRow>
                                : stableSort(rows, getComparator(order, orderBy))
                                    .filter(row => isNeedDisplay(row))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map(row => <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={row.name}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.publisher}
                                            </TableCell>
                                            <TableCell align="center">{row.name}</TableCell>
                                            <TableCell align="center">{assetsRender(row.assets)}</TableCell>
                                            <TableCell align="center">{entriesRender(row.app_ads)}</TableCell>
                                            <TableCell align="center">{entriesRender(row.ads)}</TableCell>
                                        </TableRow>
                                    )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 20, 30]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}
