import Conf from 'conf';
declare const config: Conf<Record<string, unknown>>;
declare function getNetwork(): any;
export { getNetwork, config };
