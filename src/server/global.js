import BaseServer from 'core/baseServer';
import Ajax from 'core/ajax';

class Global extends BaseServer{

	getCurrentUser = (data) => {
		return Ajax.getCache("/user/getCurrentUser",data, -1)
	}

	switchUser = (data) => {
		return Ajax.get("/user/switchUser", data)
	}

	getAllEnumData = (data) => {
		return Ajax.getCache("/enum/getAllEnumMaps",data ,-1)
	}

	getAllCompany = (data) => {
		return Ajax.getCache("/company/getAllCompanyList",data ,-1)
	}

	getAllRole = (data) => {
		return Ajax.getCache("/role/getAllRoles",data ,-1)
	}

	getAllLocation = (data) => {
		return Ajax.getCache("/location/getAllLoactions",data ,-1)
	}

	getAllDept = (data) => {
		return Ajax.getCache("/dept/getAllBiz1thDept",data ,-1)
	}

}
export default new Global
