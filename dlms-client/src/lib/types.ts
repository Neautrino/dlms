import type { DlmsContract } from "@/contract/dlms";

type Application = DlmsContract['types'][0]['type'];
type ApplicationStatus = DlmsContract['types'][1]['type'];
type Assignment = DlmsContract['types'][2]['type'];
type Project = DlmsContract['types'][3]['type'];
type ProjectStatus = DlmsContract['types'][4]['type'];
type Review = DlmsContract['types'][5]['type'];
type ReviewType = DlmsContract['types'][6]['type'];
type SystemState = DlmsContract['types'][7]['type'];
type UserAccount = DlmsContract['types'][8]['type'];
type UserRole = DlmsContract['types'][9]['type'];
type WorkVerification = DlmsContract['types'][10]['type'];

export type { 
    Application, 
    ApplicationStatus, 
    Assignment, 
    Project, 
    ProjectStatus, 
    Review, 
    ReviewType, 
    SystemState, 
    UserAccount, 
    UserRole, 
    WorkVerification 
};