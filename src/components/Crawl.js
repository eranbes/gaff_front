import React, {useEffect, useState} from "react";
import rest from "./Rest";
import {Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";

export const Crawl = ({setRoute, publisher}) => {

    const [crawl, setCrawl] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        setLoading(true)

        rest('crawls/' + publisher.id, 'PATCH')
            .then(res => {

                setLoading(false)

                if (res.status === 200) {
                    setCrawl(res.body)
                }

            })

    }, [publisher])

    const renderCells = (row, isApp) => {

        return isApp
            ? row.ns_app_ads && row.entries.length > 0
                ? row.app_ads
                    ? 'parsed'
                    : 'not exist'
                : 'no need'
            : row.ns_ads && row.entries.length > 0
                ? row.ads
                    ? 'parsed'
                    : 'not exist'
                : 'no need'

    }

    return <>

        <Typography variant="h4"
                    align="center"
                    style={{
                        margin: '1rem'
                    }}
        >
            Publisher: {publisher.name}
        </Typography>

        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Domains</TableCell>
                        <TableCell align="center">ads.txt</TableCell>
                        <TableCell align="center">app-ads.txt</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading
                        ? <TableRow>
                            <TableCell colSpan={3}>
                                <LinearProgress/>
                            </TableCell>
                        </TableRow>
                        : crawl.map(d => <TableRow key={"keyfowdomainscrawlqerv" + d.name}>
                                <TableCell component="th" scope="row">
                                    <Typography variant="h6">
                                        {d.name}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    {renderCells(d, false)}
                                </TableCell>
                                <TableCell align="center">
                                    {renderCells(d, true)}
                                </TableCell>
                            </TableRow>
                        )}
                </TableBody>
            </Table>
        </TableContainer>

        <Button
            variant="contained"
            style={{margin: '1rem'}}
            onClick={() => setRoute('publishers')}
        >
            back
        </Button>
    </>
}