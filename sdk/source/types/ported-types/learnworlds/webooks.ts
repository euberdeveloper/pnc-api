export interface LearnWorldsWebHook {
    version: number;
    type: string;
    trigger: string;
    school_id: string;
    data: any;
}

export interface UserUnenrolledWebHook extends LearnWorldsWebHook {
    type: 'userUnenrolledFromProduct';
    data: {
        product: {
            id: string;
            title: string;
            type: string;
        };
        user: {
            username: string;
            created: number;
            email: string;
            eu_customer: boolean;
            fields: {
                behace: string | null;
                bio: string | null;
                cf_skill: string | null;
                dribbble: string | null;
                fb: string | null;
                github: string | null;
                instagram: string | null;
                linkedin: string | null;
                location: string | null;
                skype: string | null;
                twitter: string | null;
                url: string | null;
            };
            id: string;
            is_admin: boolean;
            is_affiliate: boolean;
            is_instructor: boolean;
            last_login: number;
            referrer_id: string;
            subscribed_for_marketing_emails: any;
            tags: string[];
            utms: {
                fc_landing: string;
                lc_landing: string;
            };
        };
    };
}

export function instanceOfUserUnenrolledWebHook(webHook: LearnWorldsWebHook): webHook is UserUnenrolledWebHook {
    return webHook.type === 'userUnenrolledFromProduct';
}
