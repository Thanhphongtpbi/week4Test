import React from 'react'
import {Page, Card, DataTable} from '@shopify/polaris';
import { useState, useCallback, } from 'react';
export const Showprices = ({datashow}) => {
//   console.log(datashow)
//   const [datarow,setDatarow] = useState([])
  
// if (datashow=='') {
//   console.log("a")
// } else {
//   console.log("b")
  //  const datarow = datashow.map((el)=>{
  //   return [el.name, el.price , el.price ]
  // })
//   console.log(datarow)
//   setDatarow(datarow)
// }

  // console.log(datarow)
  const rows = datashow
  return (
    <Card>
        <DataTable
          columnContentTypes={[
            'text',
            'numeric',
            'numeric',
          ]}
          headings={[
            'Product',
            'Old Price $',
            'New Price $',
          ]}
          rows={rows}
        />
      </Card>
  )
}
