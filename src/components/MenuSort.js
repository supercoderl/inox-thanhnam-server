import { ListItemText, Menu, MenuItem, MenuList } from "../../node_modules/@mui/material/index"

const MenuSort = ({ open, anchorEl, setAnchorEl, cols, sort, setSort }) => {
    return (
        <Menu
            id="menu-sort"
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
        >
            <MenuList sx={{ width: 180, maxWidth: '100%' }}>
                {
                    cols.map((col, index) => {
                        return (
                            <MenuItem key={index} selected={sort.sortType === col.id} onClick={() => {
                                setSort({ ...sort, sortType: col.id });
                                setAnchorEl(null);
                            }}>
                                <ListItemText>{col.label}</ListItemText>
                            </MenuItem>
                        )
                    })
                }
            </MenuList>
        </Menu>
    )
}

export default MenuSort;