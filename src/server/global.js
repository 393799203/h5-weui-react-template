import BaseServer from 'core/baseServer';
import Ajax from 'core/ajax';

class Global extends BaseServer{

	getCurrentUser = (data) => Ajax.getCache("/api/user/getCurrentUser",data, -1)

	switchUser = (data) => Ajax.get("/api/user/switchUser", data)

	getAllEnumData = (data) => Ajax.getCache("/api/enum/getAllEnumMaps",data ,-1)

	getAllCompany = (data) => Ajax.getCache("/api/company/getAllCompanyList",data ,-1)

	getAllRole = (data) => Ajax.getCache("/api/role/getAllRoles",data ,-1)

	getAllLocation = (data) => Ajax.getCache("/api/location/getAllLoactions",data ,-1)
	//含事业群和集团
	getAllDept = (data) => Ajax.getCache("/api/dept/getAllBiz1thDept",data ,-1)
	//不含事业群和集团
	getDept = (data) => Ajax.getCache('/api/dept/getBiz1thDept', data, -1) 
	//预算部门接口
	getBudgetDept = (data) => Ajax.getCache('/api/dept/getBudgetBiz1thDept', data, -1)

}
export default new Global
