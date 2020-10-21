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

                if (res.status === 200) setData(res.body)

            })

    }, [])


    const columns = ["Publisher", "Bundle ids or domains ", "File", "app-ads.txt entries", "ads.txt entries"];


    const options = {
        // filterType: 'checkbox',
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