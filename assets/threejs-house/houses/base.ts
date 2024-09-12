import { IStairsSettings, ITopRailings, IWallSettings } from '../shapes/baseShapes';

export interface IHouseFloorSettings {
    FrontWallSettings: IWallSettings;
    LeftWallSettings: IWallSettings;
    BackWallSettings: IWallSettings;
    RightWallSettings: IWallSettings;
    StairSettings?: IStairsSettings;
    floorThickness?: number;
    wallHeight?: number;
    wallDepth?: number;
}

// The settings for the roof of the house (the top floor)
export interface IHouseRoofSettings extends IHouseFloorSettings {
    RoofBoxSettings: IHouseFloorSettings;
    Railings: ITopRailings;
    IsAShaped: boolean;
}

interface IHouseSettings {
    basements?: IHouseFloorSettings[];
    semiBasement?: IHouseFloorSettings;
    firstFloor: IHouseFloorSettings;
    highFloors?: IHouseFloorSettings[];
    roof: IHouseRoofSettings;
    isNhaCap4?: boolean;
}



export default IHouseSettings;