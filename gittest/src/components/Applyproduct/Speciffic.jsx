import React from 'react'
import { TextField, Icon, Avatar, Modal, Card, ResourceList, Thumbnail, TextStyle, ResourceItem, Scrollable, Button } from '@shopify/polaris'
import { useState, useCallback,useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import {
    CircleCancelMajor
} from '@shopify/polaris-icons';

const getAllProducts = gql`
query{
  products(first:50){
    edges{
      node{
        id
        title
        images(first:1){
          edges{
            node{
              id
              url
            }
          }
        }
        totalVariants
        variants(first:3){
          edges{
            node{
              id
              title
              price
            }
          }
        }
      }
    }
  }
}
`

export const Speciffic = ({
    handelgetvalue
}) => {
    const [items, setItems] = useState([])
    // const [data]
    const [isloading, setIsloading] = useState(true)

    const { data, loading } = useQuery(getAllProducts, {
        onCompleted(data) {
            const datapro = data.products.edges
            const dataVariants = datapro.map((el) => {
                return el.node.variants.edges
              })
            const dataimage = datapro.map((el) => {
                return el.node.images.edges
            })
            const datatitle = datapro.map((el) => {
                return el.node.title
            })
            const dataID = datapro.map((el) => {
                return el.node.id
            })
            const dataUrlImage = dataimage.map((el) => {
                const [data] = el
                return data.node.url
            })
            const dataprice = dataVariants.map((el) => {
                const [data] = el
                return data.node.price
              })
            const data2 = []
            for (let i = 0; i < 50; i++) {
                data2.push({
                    name: datatitle[i],
                    id: dataID[i],
                    url: dataUrlImage[i],
                    price: dataprice[i]
                })
            }
            setItems(data2)
            setIsloading(false)
        },
        onError(err) {
            console.log(err);
        },
    })
   

    // Hiển thị modal 
    const [textFieldValue, setTextFieldValue] = useState(``);
    const handleTextFieldChange =
        (value) => {
            setTextFieldValue(value)
            console.log(textFieldValue)
        }

    const [selectedItems, setSelectedItems] = useState([]);
    const [activeMudal, setActiveMudal] = useState(false);
    const handleOpenMudal = useCallback(() =>{
        setActiveMudal(!activeMudal);
        setSelectedItems(ItemsaveString)
    }, [activeMudal])
    
    const [valueSearch, setValueSearch] = useState();
    const handleChangesearchspecific = (newValue) => {
        setValueSearch(newValue)
        console.log(valueSearch)
    };
    const resourceName = {
        singular: 'customer',
        plural: 'customers',
    };
    // Hàm lưu cấu hình sau khi chọn 
    const [isChoice, setIsChoice] = useState(true)
    const [Itemsave, setItemsave] = useState([])
    const [ItemsaveString, setItemsaveString] = useState([])
    

    const handleSaveProduct = useCallback(()=>{
        const arr = []
        for (let i = 0; i<selectedItems.length; i++) {
            const arr1 = items.filter((el)=>{
                if (el.id ==  selectedItems[i]) {
                    return el
                }
            })
            const [arr2] =arr1
            arr.push(arr2)
        }
        console.log(arr)
        // const [arr2]= arr
        setItemsave(arr)
        handelgetvalue(arr)
        setItemsaveString(selectedItems)
    },[selectedItems])

    return (
        <div style={{
            // display: 'inline-flex',
            height: '100%',
            width: '100%',
        }}>
            <>
                <TextField
                    label="Minimum Quantity"
                    labelHidden
                    ResourceLisselectedItemsplaceholder='Search product'
                    onChange={handleTextFieldChange}
                    value={textFieldValue}
                    autoComplete="off"
                    onFocus={handleOpenMudal}
                />
                {isChoice &&
                    <div>
                        <ResourceList
                            resourceName={{ singular: 'customer', plural: 'customers' }}
                            items={Itemsave}
                            renderItem={(item) => {
                                const { id, url, name } = item;
                                const media = <Thumbnail
                                source={url}
                                alt="Black choker necklace"
                            />;
                                return (
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: "space-between",
                                        
                                    }}>
                                        <ResourceItem
                                            id={id}
                                            url={url}
                                            media={media}
                                            accessibilityLabel={`View details for ${name}`}
                                        >
                                            <h3>
                                                <TextStyle variation="strong">{name}</TextStyle>
                                            </h3>
                        
                                        </ResourceItem>
                                        {/* <Button><Icon source={CircleCancelMajor} /></Button> */}
                                    </div>

                                );
                            }}
                        />
                    </div>
                }
                <Modal
                    open={activeMudal}
                    onClose={handleOpenMudal}
                    title="Select Specific Products"
                >
                    <Modal.Section>
                        <TextField
                            label="Search Products"
                            value={valueSearch}
                            onChange={handleChangesearchspecific}
                            autoComplete="off"
                        />
                        <Scrollable shadow style={{ height: '400px' }} >
                            <Card>
                                <ResourceList
                                    resourceName={resourceName}
                                    items={items}
                                    renderItem={renderItemChoice}
                                    selectedItems={selectedItems}
                                    onSelectionChange={setSelectedItems}
                                    selectable
                                    loading={isloading}
                                />
                            </Card>
                        </Scrollable>
                        <div style={{ height: '40px', width: '100%', display: 'flex', justifyContent: "flex-end" }}><Button onClick={handleSaveProduct} primary> Select</Button></div>
                        
                    </Modal.Section>
                </Modal>
            </>
        </div>
    )
}
function renderItemChoice(item) {
    const { id, url, name, location } = item;
    const media = <Thumbnail
        source={url}
        alt="Black choker necklace"
    />;

    return (
        <ResourceItem
            id={id}
            media={media}
            accessibilityLabel={`View details for ${name}`}
        >
            <h3>
                <TextStyle varia
                    tion="strong">{name}</TextStyle>
            </h3>
        </ResourceItem>
    );
}
