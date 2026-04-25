"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var axios_1 = require("axios");
var api_1 = require("../lib/api");
var lucide_react_1 = require("lucide-react");
var table_1 = require("../components/ui/table");
var dropdown_menu_1 = require("../components/ui/dropdown-menu");
var button_1 = require("../components/ui/button");
var input_1 = require("../components/ui/input");
var badge_1 = require("../components/ui/badge");
var DashboardUsers = function () {
    var _a = (0, react_1.useState)([]), users = _a[0], setUsers = _a[1];
    var _b = (0, react_1.useState)(''), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var fetchUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, res, usersData, mappedUsers, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    token = localStorage.getItem('token');
                    return [4 /*yield*/, axios_1.default.get((0, api_1.apiUrl)('/admin/users'), {
                            headers: { Authorization: "Bearer ".concat(token) }
                        })];
                case 1:
                    res = _a.sent();
                    console.log("FULL RESPONSE:", res.data);
                    usersData = [];
                    if (Array.isArray(res.data)) {
                        usersData = res.data;
                    }
                    else if (Array.isArray(res.data.users)) {
                        usersData = res.data.users;
                    }
                    else if (Array.isArray(res.data.data)) {
                        usersData = res.data.data;
                    }
                    else if (res.data && typeof res.data === 'object') {
                        usersData = Object.values(res.data).flat().filter(function (item) { return item && typeof item === 'object'; });
                    }
                    else {
                        console.error("Unexpected API format:", res.data);
                        return [2 /*return*/];
                    }
                    mappedUsers = usersData.map(function (u) { return ({
                        id: u._id || u.id,
                        name: u.fullName || u.name || 'No Name',
                        email: u.email || '',
                        role: u.role || 'user',
                        joinedDate: new Date(u.createdAt).toLocaleDateString(),
                        status: (u.isEmailVerified ? 'active' : 'inactive')
                    }); });
                    setUsers(mappedUsers);
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error fetching users:', error_1);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        fetchUsers();
    }, []);
    var filteredUsers = users.filter(function (u) {
        return u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
    });
    return (<div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">User Management</h1>
        <p className="text-gray-500 dark:text-gray-400">Monitor and manage registered users on the platform.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative grow">
          <lucide_react_1.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
          <input_1.Input placeholder="Search users by name or email..." className="pl-10 bg-white dark:bg-neutral-900 border-none shadow-sm" value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }}/>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-neutral-800">
        <table_1.Table>
          <table_1.TableHeader>
            <table_1.TableRow className="hover:bg-transparent border-gray-100 dark:border-neutral-800">
              <table_1.TableHead>User</table_1.TableHead>
              <table_1.TableHead>Role</table_1.TableHead>
              <table_1.TableHead>Joined Date</table_1.TableHead>
              <table_1.TableHead>Status</table_1.TableHead>
              <table_1.TableHead className="text-right">Actions</table_1.TableHead>
            </table_1.TableRow>
          </table_1.TableHeader>
          <table_1.TableBody>
            {loading ? (<table_1.TableRow>
                <table_1.TableCell colSpan={5} className="text-center py-10 dark:text-white">Loading users...</table_1.TableCell>
              </table_1.TableRow>) : filteredUsers.length === 0 ? (<table_1.TableRow>
                <table_1.TableCell colSpan={5} className="text-center py-10 text-gray-500">No users found.</table_1.TableCell>
              </table_1.TableRow>) : (filteredUsers.map(function (user) { return (<table_1.TableRow key={user.id} className="border-gray-100 dark:border-neutral-800">
                  <table_1.TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-500 font-bold uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </table_1.TableCell>
                  <table_1.TableCell>
                    <badge_1.Badge className={user.role === 'admin' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 border-none'}>
                      {user.role === 'admin' && <lucide_react_1.Shield size={12} className="mr-1"/>}
                      {user.role.toUpperCase()}
                    </badge_1.Badge>
                  </table_1.TableCell>
                  <table_1.TableCell className="text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <lucide_react_1.Calendar size={14} className="mr-2"/>
                      {user.joinedDate}
                    </div>
                  </table_1.TableCell>
                  <table_1.TableCell>
                    <badge_1.Badge className={user.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-none' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-none'}>
                      {user.status.toUpperCase()}
                    </badge_1.Badge>
                  </table_1.TableCell>
                  <table_1.TableCell className="text-right">
                    <dropdown_menu_1.DropdownMenu>
                      <dropdown_menu_1.DropdownMenuTrigger asChild>
                        <button_1.Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">
                          <lucide_react_1.MoreHorizontal size={18}/>
                        </button_1.Button>
                      </dropdown_menu_1.DropdownMenuTrigger>
                      <dropdown_menu_1.DropdownMenuContent className="dark:bg-neutral-900 shadow-xl border border-gray-200 dark:border-neutral-800">
                        <dropdown_menu_1.DropdownMenuLabel>User Actions</dropdown_menu_1.DropdownMenuLabel>
                        <dropdown_menu_1.DropdownMenuItem>
                          <lucide_react_1.Mail size={14} className="mr-2"/>
                          Email User
                        </dropdown_menu_1.DropdownMenuItem>
                        <dropdown_menu_1.DropdownMenuItem>
                          <lucide_react_1.Edit size={14} className="mr-2"/>
                          Edit Details
                        </dropdown_menu_1.DropdownMenuItem>
                        <dropdown_menu_1.DropdownMenuSeparator className="dark:bg-neutral-800"/>
                        <dropdown_menu_1.DropdownMenuItem className="text-red-500 focus:text-red-500">
                          Suspend Account
                        </dropdown_menu_1.DropdownMenuItem>
                      </dropdown_menu_1.DropdownMenuContent>
                    </dropdown_menu_1.DropdownMenu>
                  </table_1.TableCell>
                </table_1.TableRow>); }))}
          </table_1.TableBody>
        </table_1.Table>
      </div>
    </div>);
};
exports.default = DashboardUsers;
