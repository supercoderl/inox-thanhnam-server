import axiosInstance from "config/axios";
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from "../../node_modules/@mui/material/index"
import { FileWordOutlined, ExportOutlined, FilePdfOutlined, FileImageOutlined, FileExcelOutlined, FileTextOutlined, PythonOutlined, Html5Outlined, FileJpgOutlined } from "@ant-design/icons";

const MenuExport = ({ open, anchorEl, setAnchorEl, exportObject }) => {

    const handleExport = async (exportType) => {
        switch (exportType) {
            case "xlsx":
                await axiosInstance.post(`File/export-excel?type=${exportObject}`, { responseType: "arraybuffer" }).then((response) => {
                    var result = response.data;
                    if (!result) return;
                    else {
                        const ab = new ArrayBuffer(atob(result).length);
                        const ia = new Uint8Array(ab);
                        for (let i = 0; i < atob(result).length; i++) {
                          ia[i] = atob(result).charCodeAt(i);
                        }
                        const blob = new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${exportObject}.xlsx`;
                        a.click();
                        window.URL.revokeObjectURL(url);
                        a.remove();
                    }
                }).catch((error) => console.log(error));
                break;
        }
    }

    return (
        <Menu
            id="menu-export"
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
        >
            <MenuList sx={{ width: 180, maxWidth: '100%' }}>
                <MenuItem>
                    <ListItemIcon>
                        <FileWordOutlined />
                    </ListItemIcon>
                    <ListItemText>Word</ListItemText>
                    <ListItemIcon>
                        <ExportOutlined />
                    </ListItemIcon>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <FilePdfOutlined />
                    </ListItemIcon>
                    <ListItemText>Pdf</ListItemText>
                    <ListItemIcon>
                        <ExportOutlined />
                    </ListItemIcon>
                </MenuItem>
                <Divider />
                <MenuItem>
                    <ListItemIcon>
                        <FileImageOutlined />
                    </ListItemIcon>
                    <ListItemText>Png</ListItemText>
                    <ListItemIcon>
                        <ExportOutlined />
                    </ListItemIcon>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <FileJpgOutlined />
                    </ListItemIcon>
                    <ListItemText>Jpg</ListItemText>
                    <ListItemIcon>
                        <ExportOutlined />
                    </ListItemIcon>
                </MenuItem>
                <Divider />
                <MenuItem>
                    <ListItemIcon>
                        <FileTextOutlined />
                    </ListItemIcon>
                    <ListItemText>Csv</ListItemText>
                    <ListItemIcon>
                        <ExportOutlined />
                    </ListItemIcon>
                </MenuItem>
                <MenuItem onClick={() => handleExport("xlsx")}>
                    <ListItemIcon>
                        <FileExcelOutlined />
                    </ListItemIcon>
                    <ListItemText>Xlsx</ListItemText>
                    <ListItemIcon>
                        <ExportOutlined />
                    </ListItemIcon>
                </MenuItem>
                <Divider />
                <MenuItem>
                    <ListItemIcon>
                        <PythonOutlined />
                    </ListItemIcon>
                    <ListItemText>Python</ListItemText>
                    <ListItemIcon>
                        <ExportOutlined />
                    </ListItemIcon>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <Html5Outlined />
                    </ListItemIcon>
                    <ListItemText>Html</ListItemText>
                    <ListItemIcon>
                        <ExportOutlined />
                    </ListItemIcon>
                </MenuItem>
            </MenuList>
        </Menu>
    )
}

export default MenuExport;