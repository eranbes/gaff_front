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

        // console.log(publisher)

        // publisher.domains.map(d => {

            // if (d.ns_app_ads) {
            //     fetch(d.name + 'app-ads.txt')
            //         .then(r => console.log(d.name + 'app-ads.txt', r))
            // }
            //
            // if (d.ns_ads) {
            //     fetch(d.name + 'ads.txt')
            //         .then(r => console.log(d.name + 'ads.txt', r))
            // }

        // })

        setLoading(true)

        rest('crawl/' + publisher.id)
            .then(res => {

                setLoading(false)

                if (res.status === 200) {
                    setCrawl(res.body)
                }

            })

    }, [publisher])

    const renderCells = (row, isApp) => {

        // console.log(row)

        // return isApp
        //     ? row.ns_app_ads
        //         ? fetch(row.name + 'app-ads.txt')
        //             .then(r => {
        //                 console.log(r.name + 'app-ads.txt', r)
        //                 return r.ok
        //                     ? 'exist'
        //                     : 'not exist'
        //             })
        //         : 'no need'
        //     : row.ns_ads
        //         ? fetch(row.name + 'ads.txt')
        //             .then(r => {
        //                 console.log(r.name + 'ads.txt', r)
        //                 return r.ok
        //                     ? 'exist'
        //                     : 'not exist'
        //             })
        //         : 'no need'

        return isApp
            ? row.ns_app_ads
                ? row.app_ads
                    ? 'exist'
                    : 'not exist'
                : 'no need'
            : row.ns_ads
                ? row.ads
                    ? 'exist'
                    : 'not exist'
                : 'no need'

    }

    return <>
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