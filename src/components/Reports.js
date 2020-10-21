import React, {useEffect, useState} from 'react';
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import {Paper, Typography} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import MUIDataTable from "mui-datatables";
import rest from "./Rest";

export const Reports = ({setRoute}) => {

    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        setLoading(true)

        rest('crawls')
            .then(res => {

                setLoading(false)

                if (res.status === 200) {

                    setData(res.body)

                    console.log(res.body)

                }

            })

    }, [])

    const columns = [
        {
            name: "publisher",
            label: "Publisher",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "name",
            label: "Domain",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "asset",
            label: "Bundle ids or domains",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "app_ads",
            label: "app-ads.txt entries",
            options: {
                filter: true,
                sort: false,
                customBodyRender: value => value ? 'true' : 'false'
            }
        },
        {
            name: "ads",
            label: "ads.txt entries",
            options: {
                filter: true,
                sort: false,
            }
        },
    ]

    const options = {
        // filterType: 'checkbox',
        selectableRows: 'none'
    };

    return loading
        ? <LinearProgress/>
        : <>
            <IconButton onClick={() => setRoute('publishers')}>
                <ArrowBackIcon/>
            </IconButton>

            <Grid container
                  style={{padding: '1rem'}}
                  direction={"column"} alignItems={"center"}>

                <Grid item>
                    <MUIDataTable
                        title="Reports"
                        data={data}
                        columns={columns}
                        options={options}
                    />

                </Grid>
            </Grid>
        </>
}